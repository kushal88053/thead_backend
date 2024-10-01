
const queries = {}

const mutation = {
    createUser: async (_: any, { }: {}) => {
        return "randomid";
    }
}

export const resolvers =
{
    queries, mutation
};