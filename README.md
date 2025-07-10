# Resilient Email Sending Service

This project implements a robust and resilient email sending service using TypeScript and Node.js (Express.js). It demonstrates several key features essential for a reliable communication system, including retry mechanisms, fallback providers, idempotency, rate limiting, status tracking, and the circuit breaker pattern.

## Features

The `EmailService` class is the core of this application, providing the following functionalities:

* **Mock Email Providers:** Integrates with two mock email providers (`MockProvider1` and `MockProvider2`) to simulate external email sending services with varying success rates.
* **Retry Mechanism:** Automatically retries failed email sending attempts.
* **Exponential Backoff:** Implements exponential backoff between retries to avoid overwhelming the providers.
* **Fallback between Providers:** If the primary provider fails after retries, the service automatically attempts to send the email using a secondary provider.
* **Idempotency:** Prevents duplicate email sends for the same unique `id`, ensuring an email is processed only once even if the send request is re-triggered multiple times.
* **Rate Limiting:** Limits the number of emails that can be sent within a specific time window to prevent abuse or exceeding provider limits.
* **Status Tracking:** Provides a mechanism to query the current status of an email sending attempt (e.g., pending, sent, rate-limited, failed, skipped-duplicate).
* **Circuit Breaker Pattern (Bonus):** Monitors provider failures and temporarily "opens the circuit" (stops sending requests) to a failing provider if it consistently fails, allowing it time to recover and preventing cascading failures.
* **Simple Logging (Bonus):** Basic console logging is implemented to track the flow of email sending, retries, and errors.
* **Basic Queue System (Bonus):** An `EmailQueue` class is provided to asynchronously process email sending requests, preventing blocking of the main API thread.

## Technologies Used

* **TypeScript:** For type-safe and scalable JavaScript development.
* **Node.js:** JavaScript runtime environment.
* **Express.js:** Fast, unopinionated, minimalist web framework for Node.js.
* **Jest:** JavaScript testing framework for unit tests.



Screencast Explanation of Demo & Code (Video showing your face):

[PASTE YOUR VIDEO URL HERE]
(e.g., https://www.youtube.com/watch?v=your-video-id or a Google Drive/Vimeo link)
This video will walk through the source code, explain the implementation of each feature (retry, fallback, idempotency, rate limiting, circuit breaker, status tracking, queue), and demonstrate the API endpoints in action (e.g., using Postman or curl) while showing your face.

Cloud Deployed Version of the API Endpoint:

[PASTE YOUR LIVE RENDER URL HERE]
(e.g., https://email-service-task-27bu.onrender.com)
This is the live endpoint where the Email Service API is deployed and accessible.
