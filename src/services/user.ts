import { prismaClient } from "../lib/db";
import { createHmac, randomBytes } from 'node:crypto';
import { ApolloError } from 'apollo-server-express';
import jwt from 'jsonwebtoken'; // Correct import syntax

export interface CreateUserPayload {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface GetUserTokenPayload {
    email: string;
    password: string;
}

class UserService {

    private static createHash(salt: string, password: string): string {
        return createHmac('sha256', salt).update(password).digest('hex');
    }

    public static async createUser(payload: CreateUserPayload) {
        const { firstName, lastName, email, password } = payload;

        // Check if the email already exists in the database
        const existingUser = await prismaClient.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            // Throw a custom ApolloError with a user-friendly message
            throw new ApolloError('Email already exists', 'EMAIL_ALREADY_EXISTS');
        } else {
            // Generate salt and hash the password
            const salt = randomBytes(16).toString('hex');
            const hashedPassword = this.createHash(salt, password); // Use `this` for static method

            // Use Prisma to create the new user
            return prismaClient.user.create({
                data: {
                    firstName,
                    lastName,
                    email,
                    password: hashedPassword,
                    salt
                }
            });
        }
    }

    public static async getUserToken(payload: GetUserTokenPayload) {
        const { email, password } = payload;

        // Check if the email exists in the database
        const existingUser = await prismaClient.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            // Generate salt and hash the password
            const hashedPassword = this.createHash(existingUser.salt, password); // Use `this` for static method

            // Check if the hashed password matches
            if (hashedPassword === existingUser.password) {
                // Create a token if credentials are correct
                const user = {
                    id: existingUser.id,
                    email: existingUser.email
                };

                // Create a token with user data
                const token = jwt.sign(user, '123123', { expiresIn: '1h' });
                return { token }; // Return the token in an object
            } else {
                throw new ApolloError('Invalid password', 'INVALID_PASSWORD');
            }
        } else {
            throw new ApolloError('Email does not exist', 'EMAIL_NOT_EXISTS');
        }
    }
}

export default UserService;
