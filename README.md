# Bitespeed Backend Task -> Identity Reconciliation
DEPLOYED LINK: https://bitespeed-assignment-6d49.onrender.com/ 
[it's running on free instance of Render, may delay upto 50 seconds :) ]


POST '/identify' :

### Example Request

```json
{
  "email": "mcfly@hillvalley.edu",
  "phoneNumber": "123456"
}
```
### Example Response
```{
  "contact": {
    "primaryContactId": 1,
    "emails": [
      "lorraine@hillvalley.edu",
      "mcfly@hillvalley.edu"
    ],
    "phoneNumbers": ["123456"],
    "secondaryContactIds": [23]
  }
}
```
### Running Locally
```
npm install
npx prisma generate
npm run dev
```
Server runs at:
```http://localhost:8000```

### DB storage screenshot
<img width="1919" height="933" alt="image" src="https://github.com/user-attachments/assets/9c9fe70a-8dd9-453b-8878-277fe4347921" />

