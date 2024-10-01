import UserService, { CreateUserPayload, GetUserTokenPayload } from "../../services/user";

const queries = {

    token: async (_: any, payload: GetUserTokenPayload) => {
        return await UserService.getUserToken(payload);
    }

}

const mutation = {
    createUser: async (_: any, payload: CreateUserPayload) => {
        const res = await UserService.createUser(payload);
        return res.id;
    }
}

export const resolvers =
{
    queries, mutation
};