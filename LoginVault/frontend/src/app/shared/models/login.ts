import { Category } from "./category";
import { LoginVaultEntity } from "./login-vault-entity";

export interface Login extends LoginVaultEntity {
  url: string;
  description: string;
  username: string;
  password: string;
  category: Category;
  hashtags: string[];
}
