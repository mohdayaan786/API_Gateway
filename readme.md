# **API Gateway - Middle-End Architecture**  

## **Overview**  
In a microservices architecture, we introduce an **intermediate layer (Middle-End)** between the **Frontend** and **Backend** to enhance communication and decision-making.  

## **Why Middle-End?**  
- It acts as a bridge between the client (Frontend) and microservices (Backend).  
- It helps decide which microservice should handle incoming requests.  
- It improves security, efficiency, and scalability.  

## **Key Features**  
✔ **Message Validation** – Ensures that incoming requests meet the required format and structure.  
✔ **Response Transformation** – Converts backend responses into a format suitable for the frontend.  
✔ **Rate Limiting** – Prevents API abuse by limiting the number of requests per user.  
✔ **Authentication Middleware** – Ensures only authorized users access certain services.  
✔ **API Gateway** – Serves as the middleware to manage these operations.  

## **System Architecture**  
The API Gateway interacts with the following services:
- **Auth Service (PORT2)** – Handles user authentication.
- **Flight and Search Service (PORT1)** – Manages flight data and search functionality.
- **Booking Service (PORT3)** – Handles flight bookings.

## **Setup Guide**  
### 1️⃣ Install Dependencies  
```sh
npm install
```

### 2️⃣ Set Up Environment Variables  
Create a `.env` file and define the following variables:  
```
PORT=3004  
PORT1=3000  
PORT2=3001  
PORT3=3002  
```

### 3️⃣ Start the API Gateway  
Run the command:  
```sh
npm start
```

## **Routing and Middleware**  
### **Rate Limiting**  
Requests are limited to 5 requests per 2 minutes to prevent abuse.

### **Authentication Flow**  
1. A request to `/bookingservice` requires an authentication token.
2. The API Gateway verifies the token with the **Auth Service**.
3. If authenticated, the request is forwarded to the **Booking Service**.
4. Otherwise, a `401 Unauthorized` response is returned.

### **Proxy Routing**  
| Path                  | Target Service |
|----------------------|---------------|
| `/bookingservice`   | Booking Service (PORT3) |
| `/flightandsearchservice` | Flight and Search Service (PORT1) |
| `/authservice`      | Auth Service (PORT2) |

## **Example API Requests**  
### 1️⃣ **Booking Service (Requires Authentication)**  
```sh
curl -H "x-access-token: <TOKEN>" http://localhost:3000/bookingservice/api/v1/book
```

### 2️⃣ **Flight Search**  
```sh
curl http://localhost:3000/flightandsearchservice/api/v1/flights
```

### 3️⃣ **User Authentication Check**  
```sh
curl -H "x-access-token: <TOKEN>" http://localhost:3000/authservice/api/v1/isAuthenticated
```

## **Conclusion**  
By implementing an API Gateway as a **Middle-End**, we optimize request handling, improve performance, and ensure seamless integration between the client and backend services. 🚀  

