const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  topic:{
      type:String,
      required:true,
  },
  difficulty:{
      type:String,
      required:true,
  },
  question:{
      type:String,
      required:true,
  },
  option1:{
    type:String,
    required:true,
},
 option2:{
    type:String,
    required:true,
},
 option3:{
    type:String,
    required:true,
},
  option4:{
    type:String,
    required:true,
},
 correct:{
    type:Number,
    required:true,
}
});

const Question = mongoose.model("Question", QuestionSchema);

module.exports = Question;