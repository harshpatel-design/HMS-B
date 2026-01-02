import mongoose from "mongoose";


const DoctorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    address: {
      line1: {
        type: String,
        trim: true,
      },
      line2: {
        type: String,
        trim: true,
      },
      city: {
        type: String,
        trim: true,
      },
      state: {
        type: String,
        trim: true,
      },
      pincode: {
        type: String,
        trim: true,
      },
      country: {
        type: String,
        default: "India",
      },
    },
    specialization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Specialization",
      required: true
    },

    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true
    },

    experience: { type: Number, default: 0 },

    bio: { type: String },

    education: [
      {
        degree: String,
        institute: String,
        year: Number
      }
    ],
    schedule: [
      {
        day: {
          type: String,
          enum: [
            "MONDAY",
            "TUESDAY",
            "WEDNESDAY",
            "THURSDAY",
            "FRIDAY",
            "SATURDAY",
            "SUNDAY",
          ],
          required: true,
        },

        sessions: [
          {
            sessionName: {
              type: String,
              enum: ["MORNING", "AFTERNOON", "EVENING"],
              required: true,
            },

            from: {
              type: String,
              required: true,
            },

            to: {
              type: String,
              required: true,
            },
          },
        ],
      },
    ],
    appointmentType: {
      type: String,
      enum: ["ONLINE", "IN_PERSON", "BOTH"],
      default: "IN_PERSON",
    },

    advanceBookingDays: {
      type: Number,
      default: 7,
      min: 0,
    },

    slotDuration: {
      type: Number,
      default: 15,
    },

    maxBookingsPerSlot: {
      type: Number,
      default: 1,
    },

    awards: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },


        date: {
          type: Date,
        },
      },
    ],

    certifications: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },
        date: {
          type: Date,
        },
      },
    ],

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Doctor", DoctorSchema);
