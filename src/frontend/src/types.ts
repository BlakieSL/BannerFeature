import rootReducer from './reducers';

export type RootState = ReturnType<typeof rootReducer>;
export interface GroupBanner {
    name: string;
}

export interface BannerDtoRequest {
    title: string;
    body?: string;
    plannedDate?: string | null;
    status: number;
    sendResult?: string;
    codeTypeBanner: number;
    externalId?: number;
    note?: string;
    codeGroupBanner: number;
    groupClients?: Set<number>;
    singleClients?: Set<number>;
}