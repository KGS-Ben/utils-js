export * from './lib/axios-utils';
export * from './lib/passport';
export * from './lib/express-middlewares/validateRequest';
export * from './lib/lru';

import { AxiosDecorator } from './lib/axios-utils';
import { PassportDecorator } from './lib/passport';
import { validateBody, validateQuery } from './lib/express-middlewares/validateRequest';
import { Lru } from './lib/lru';
import {
    sleep,
    convertTimeStringToSeconds,
    randomElement,
    roundToNearest,
    deleteFiles,
    decapitalizeFirstLetter,
    randomRange,
} from './lib/generic';

export default {
    AxiosDecorator,
    PassportDecorator,
    Lru,
    expressMiddlewares: {
        validateBody,
        validateQuery,
    },
    generic: {
        sleep,
        convertTimeStringToSeconds,
        randomElement,
        roundToNearest,
        deleteFiles,
        decapitalizeFirstLetter,
        randomRange,
    }
};
