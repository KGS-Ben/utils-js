import { AxiosDecorator } from './lib/axios-utils';
import { PassportDecorator } from './lib/passport';
import { validateBody, validateQuery } from './lib/express-middlewares/validateRequest';

export default {
    AxiosDecorator,
    PassportDecorator,
    expressMiddlewares: {
        validateBody,
        validateQuery,
    },
};
