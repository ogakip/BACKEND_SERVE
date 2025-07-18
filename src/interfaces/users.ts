export interface LogUserProps {
    username: string
    password: string
}

export interface RegUserProps extends LogUserProps {
    is_admin: boolean
}

export interface UpdUserProps {
  id: number;
  password?: string;
  is_admin?: boolean;
  is_active?: boolean;
}

export interface CancUserProps { id: number, is_active: boolean }