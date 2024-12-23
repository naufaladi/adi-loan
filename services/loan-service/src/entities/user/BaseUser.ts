import { Column, Entity } from "typeorm";
import { Base } from "../Base";

@Entity()
export abstract class BaseUser extends Base {
  @Column({ length: 100 })
  name: string;

  @Column({ unique: true })
  email: string;

  // TODO add more as needed (e.g. address, mobileNo, etc.)
}
