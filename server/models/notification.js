import mongoose, { Schema } from 'mongoose'

const notifSchema = new Schema(
  {
    team: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    text: { type: String },
    task: { type: Schema.Types.ObjectId, ref: 'Task' },
    notifType: { type: String, default: 'alert', enum: ['alert', 'message'] },
    isRead: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
)

const Notif = mongoose.model('Notif', notifSchema)

export default Notif
