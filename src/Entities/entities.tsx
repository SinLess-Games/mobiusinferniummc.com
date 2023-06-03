import {
    Cascade,
    Collection,
    Entity, Enum,
    OneToMany,
    PrimaryKey,
    Property,
    Unique,
} from "@mikro-orm/core";
import { defaultEntities } from "@next-auth/mikro-orm-adapter";
import {randomUUID} from "crypto";

const Account = defaultEntities.Account
const Session = defaultEntities.Session

enum Role {
    User = 'User',
    Admin = 'Admin',
    Dev = 'Developer',
    Ban = 'BANNED'
}

@Entity()
export class User implements defaultEntities.User {
    @PrimaryKey()
    id: string = randomUUID();

    @Property({ nullable: true })
    name?: string;

    @Property({ nullable: true })
    @Unique()
    email: string;

    @Property({ type: "Date", nullable: true })
    emailVerified: Date | null = null;

    @Property({ nullable: true })
    image?: string;

    @OneToMany({
        entity: () => Session,
        mappedBy: (session) => session.user,
        hidden: true,
        orphanRemoval: true,
        cascade: [Cascade.ALL],
    })
    sessions = new Collection<Session>(this)

    @OneToMany({
        entity: () => Account,
        mappedBy: (account) => account.user,
        hidden: true,
        orphanRemoval: true,
        cascade: [Cascade.ALL],
    })
    accounts = new Collection<Account>(this);

    @Enum({ items: () => Role, array: true, default: [Role.User] })
    roles: Role[] = [Role.User];
}
