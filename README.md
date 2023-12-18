# Membership Form [Visit](https://yoga-subscription-qv9z.vercel.app/getSubscription).

## Introduction

Welcome to the Membership Form project!

- **Age Requirement:** Users between the ages of 18 and 65 are eligible to subscribe.

- **Subscription Duration:** Users can subscribe any day of the month, and their subscription will be valid until the end of that month. For example, if a user joins on December 17, 2023, their subscription will be valid until December 31, 2023.

- **Batch Selection:** Once users subscribe to a batch, they cannot change batches for the duration of their valid subscription. Batch changes are allowed in the next subscription cycle.

## Assumptions

To streamline the functionality of the application, we make the following assumptions:

- **User Identification:** Users are uniquely identified by their phone numbers.

- **Batch Subscription:** Users are not allowed to change batches during the month of their valid subscription. Additionally, they cannot subscribe to another batch during this time.

- **Payment Process:** Pressing the "Pay Rs 500" button triggers an abstract information request, allowing the backend to initiate a payment using the `CreatePayment` function. The response is then sent to the user based on the payment status.

- **Subscription Details:** Users can retrieve their subscription details from another form included in the project.

## Designs

![Diagram 1](/public/design.svg)
