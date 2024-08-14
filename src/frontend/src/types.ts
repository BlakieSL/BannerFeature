import rootReducer from './reducers';

export type RootState = ReturnType<typeof rootReducer>;
export interface GroupBanner {
    codeGroupBanner: number;
    name: string;
}

export interface BannerDtoRequest {
    codeBanner?: number;
    title: string;
    body?: string;
    plannedDate?: string;
    status?: number;
    sendResult?: string;
    codeTypeBanner: number;
    externalId?: number;
    note?: string;
    codeGroupBanner: number;
    groupClients?: number[];
    singleClients?: number[];
}

export interface SimplifiedGroupClientDto {
    codeGroup: number;
    nameGroup: string;
}

export interface SimplifiedClientDto {
    codeClient: number;
    surname: string;
    phone: string;
}

export interface BannerDto {
    codeBanner?: number;
    title?: string;
    body?: string;
    plannedDate?: string;
    status?: number;
    sendResult?: string;
    codeTypeBanner?: number;
    externalId?: number;
    note?: string;
    codeGroupBanner: number;
    groupClients?: Set<SimplifiedGroupClientDto>;
    singleClients?: Set<SimplifiedClientDto>;
}

export interface Client {
    codeClient: number;
    surname: string;
}

export interface GroupClient {
    codeGroup: number;
    nameGroup: string;
    codeParentGroup: number;
    children: GroupClient[];
}

export interface SelectedGroupClientsState {
    groupClients: GroupClient[];
}

export interface SelectedClientsState {
    clients: Client[];
}

export interface BannerType{
    codeTypeBanner: number;
    name: string;
}
