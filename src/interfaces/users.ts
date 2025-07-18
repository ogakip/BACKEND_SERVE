export interface LogUserProps {
    username: string
    password: string
}

export interface RegUserProps extends LogUserProps {
    is_admin: boolean
}

export interface UpdUserPros {
    id: number,
    password: string
}

export interface CancUserProps { id: number, is_active: boolean }