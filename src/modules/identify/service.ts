import {prisma} from "../../config/prisma.js"
import type {IdentifyInput } from "./schema.js"
import { LinkPrecedence } from "@prisma/client"

export const identifyService = async(input:IdentifyInput) => {
    return prisma.$transaction(async (tx) => {
        const {email,phoneNumber} = input;
        //match found
        const matched = await tx.contact.findMany({
            where:{
                OR: [
                    email ? { email } : undefined,
                    phoneNumber ? { phoneNumber } : undefined,
                ].filter(Boolean) as any,
            },
            orderBy: {createdAt:"asc"}
        })
        //no matech -> new primary
         if (matched.length === 0) {
            const newContact = await tx.contact.create({
                data: {
                email: email ?? null,
                phoneNumber: phoneNumber ?? null,
                linkPrecedence: LinkPrecedence.primary,
                },
            });
            return {
                primaryContactId: newContact.id,
                emails: email ? [email] : [],
                phoneNumbers: phoneNumber ? [phoneNumber] : [],
                secondaryContactIds: [],
            };
        }
        const ids = new Set<number>();
        matched.forEach((c) => ids.add(c.id));

        const related = await tx.contact.findMany({
            where: {
                OR: [
                { id: { in: Array.from(ids) } },
                { linkedId: { in: Array.from(ids) } },
                ],
            },
            orderBy: { createdAt: "asc" },
        });
        const primary = related.find((c) => c.linkPrecedence === LinkPrecedence.primary) ?? related[0];
        if (!primary) {
            throw new Error("Primary contact not found");
        }
        const otherPrimaries = related.filter((c) => c.linkPrecedence === LinkPrecedence.primary && c.id !== primary!.id);
        for(const p of otherPrimaries) {
            await tx.contact.update({
                where:{id:p.id},
                data:{
                    linkPrecedence:LinkPrecedence.secondary,
                    linkedId:primary?.id,
                }
            })
        }

        const existingEmails = new Set(related.map((c) => c.email).filter(Boolean));
        const existingPhones = new Set(related.map((c) => c.phoneNumber).filter(Boolean));
        const isNewEmail = email && !existingEmails.has(email);
        const isNewPhone = phoneNumber && !existingPhones.has(phoneNumber);
        if(isNewEmail || isNewPhone){
            await tx.contact.create({
                data:{
                    email: email ?? null,
                    phoneNumber: phoneNumber ?? null,
                    linkPrecedence: LinkPrecedence.secondary,
                    linkedId: primary!.id,
                }
            })
        }

        const finalContacts = await tx.contact.findMany({
        where: { OR: [{ id: primary!.id }, { linkedId: primary!.id }]},
        orderBy: { createdAt: "asc" },
        });

        const emails= Array.from(new Set(finalContacts.map((c) => c.email).filter(Boolean))) as string[];
        const phoneNumbers= Array.from(new Set(finalContacts.map((c) => c.phoneNumber).filter(Boolean))) as string[];
        const secondaryIds= finalContacts.filter((c) => c.linkPrecedence === LinkPrecedence.secondary).map((c) => c.id);

        return {
            primaryContactId:primary?.id,
            emails,
            phoneNumbers,
            secondaryContactIds:secondaryIds
        }
    },{
    timeout: 10000, // 10 seconds
  })
    
}