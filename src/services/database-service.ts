import { Model, Mongoose } from 'mongoose';
import createCommentModel, { CommentInstance } from '../models/comment-model';
import createPollModel, { PollInstance } from '../models/poll-model';
import Service from './service';
import ServiceContainer from './service-container';
import createUserModel, { UserInstance } from '../models/user-model';

/**
 * Database service class.
 * 
 * This service is used to interact with database(s). Models must be registered in this service.
 */
export default class DatabaseService extends Service {

    public readonly comments: Model<CommentInstance>;
    public readonly polls: Model<PollInstance>;
    public readonly users: Model<UserInstance>; 
    private readonly mongoose: Mongoose;

    /**
     * Creates a new database service.
     * 
     * @param container Services container
     */
    public constructor(container: ServiceContainer) {
        super(container);
        this.mongoose = this.createMongoose();
        this.comments = createCommentModel(container, this.mongoose);
        this.polls = createPollModel(container, this.mongoose);
        this.users = createUserModel(container, this.mongoose);
    }

    /**
     * Connects to a database.
     * 
     * @param host Host
     * @param port Port
     * @param dbName Database name
     * @async
     */
    public async connect(host: string, port: string | number, dbName: string): Promise<void> {
        await this.mongoose.connect(`mongodb://${host}:${port}/${dbName}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    }

    /**
     * Disconnects from a database.
     * 
     * @async
     */
    public async disconnect(): Promise<void> {
        await this.mongoose.disconnect();
    }

    /**
     * Creates Mongoose instance.
     * 
     * @returns Mongoose instance
     */
    private createMongoose(): Mongoose {
        const mongoose = new Mongoose();
        mongoose.set('useCreateIndex', true);
        return mongoose;
    }
}
