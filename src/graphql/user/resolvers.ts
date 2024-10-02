import UserService, { CreateUserPayload, GetUserTokenPayload } from "../../services/user";

const queries = {

    getUserToken: async (_: any, payload: GetUserTokenPayload) => {
        return await UserService.getUserToken(payload);
    }
    ,
    getCurrentLoggedInUser: async (_: any, parameter: any, context: any) => {
        console.log(context);
        if (context && context.user) {

            const id = context.user.id;
            const user = await UserService.getUserById(id);
            console.log(`user `, user);
            return user;
        }
        else {
            return {};
        }
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