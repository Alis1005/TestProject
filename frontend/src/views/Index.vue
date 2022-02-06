<template>
  <v-card
    class="mx-auto mt-12"
    max-width="800"
    elevation="1"
  >
    <v-img
      height="350"
      src="../assets/food.jpg"
    ></v-img>

    <v-card-title>Food is life</v-card-title>
    <v-card-text>

      <div>Dear diet, things just aren’t looking good for the both of us.
           It’s not me, it’s you. You’re too much work.
           You’re boring and I can’t stop cheating on you.</div>
    </v-card-text>
    <v-divider class="mx-4"></v-divider>
       <v-card-text>
           Write a comment
      <v-form ref="vForm">
        <v-row class="mt-1">
        <v-col
          cols="12"
          sm="12"
          md="12"
          lg="12"
        >
          <v-text-field
          style="max-width:300px"
          :rules="[formRules.required]"
          v-model="name"
          class="ml-4"
          outlined
          label="Enter your name"
          color="grey"
          dense
          >
        </v-text-field>
        <v-textarea
          color="grey"
          :rules="[formRules.required]"
          v-model="comment_description"
          class="ml-4"
          lines
          auto-grow
          outlined
          rows="2"
          dense
          name="input-7-4"
          label="Write your comments"
        ></v-textarea>
        
    <v-btn
      class="ml-4"
      dense
      color="primary"
      @click="addComments(false, '')"
    >
    Comment
    </v-btn>
      </v-col>
    </v-row>
    </v-form>
    </v-card-text>
    <v-card-text v-if="comments.length > 0">
        <v-divider class="mx-4"></v-divider>
    <v-card-text class="font-weight-bold">
        Comments
    </v-card-text>
      <v-list>
      <template v-for="(comment, index) in comments">

        <v-list-item
          :key="comment.id"
        >

          <v-list-item-content>
            <v-list-item-title> 
          <v-avatar
            color="blue"
            size="30"
          >
            <span class="white--text">{{comment.name.charAt(0)}}</span>
          </v-avatar>
           {{ comment.name }}
              <span style="font-size: 10px;">{{ timeDifference(comment.created_at) }}</span>
            </v-list-item-title>

            <p class="grey--text ml-9" style="line-height:20px;">{{comment.comment_description}}</p>
            <span class="ml-14 blue--text"
             style="font-size: 12px; cursor:pointer; max-width: 30px;"
              @click="clickReply(index)">
              Reply
             </span>

             <span class="ml-4 blue--text"
              style="font-size: 12px;  max-width: 80px; "
               >
               {{comment.totalReplies}}
               <v-icon
               small
               style="cursor:pointer;"
               @click="clickViewReply(index)"
               color="blue">
               mdi-chat-outline
               </v-icon>
             </span>

            <reply
              :trigger ="trigger"
              :isReply ="comment.isReplyClicked"
              :ParentID="comment.id"
              :viewReplies="comment.viewReplies"
              :replies="comment.replies"
              :index ="index"
              ></reply>
            
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-list>
    </v-card-text>
  </v-card>
</template>
<script>
export default {
  name: 'Index',
  components: {
    'reply' : () => import('../components/RepliesComponent.vue')
  },
  data: () => ({
    trigger: false,
    comments: [],
    name: null,
    comment_description: null
  }),
  mounted() {
    this.getComments();
  /**
   * Event listener to recall addComments function from the first layer of replies
   */
    this.eventHub.$on('Reply', data=>{
      this.addComments(true, data);      
    });
    /**
    * Event listener to open the last layer of replies with reply field
    */
    this.eventHub.$on('OpenLastReply', data=>{
      if(this.comments[data.index].replies[data.replyIndex]){
      this.comments[data.index].replies[data.replyIndex].isReplyClicked = this.comments[data.index].replies[data.replyIndex].isReplyClicked  ? false : true;
      this.comments[data.index].replies[data.replyIndex].viewReplies = true;
      this.$forceUpdate();
      this.trigger = !this.trigger;
      }
    });
    /**
    * Event listener to open the last layer of replies
    */
    this.eventHub.$on('ViewLastReply', data=>{
      if(this.comments[data.index].replies[data.replyIndex]){
       this.comments[data.index].replies[data.replyIndex].viewReplies =  this.comments[data.index].replies[data.replyIndex].viewReplies ? false : true;
      if(!this.comments[data.index].replies[data.replyIndex].viewReplies){
        this.comments[data.index].replies[data.replyIndex].isReplyClicked = false;
      }
      this.$forceUpdate();
      this.trigger = !this.trigger;
      }
    });
},
	methods : {
    /**
    * Open reply with reply fields
    * @param index integer | comment index
    */
   clickReply(index){
      this.comments[index].isReplyClicked = this.comments[index].isReplyClicked  ? false : true;
      this.comments[index].viewReplies = true;
      this.$forceUpdate();
    },
    /**
    * Open replies
    * @param index integer | comment index
    */
    clickViewReply(index){
      this.comments[index].viewReplies =  this.comments[index].viewReplies ? false : true;
      if(!this.comments[index].viewReplies){
        this.comments[index].isReplyClicked = false;
      }
      this.$forceUpdate();
    },
    /**
    * Get comments from api
    */
    getComments () {
      let tempData = this.comments;
      this.axiosCall('/api/comments', 'GET')
				.then((res) => {
         this.comments = res.data;
         if(tempData.length > 0){
           for(let data of tempData){
             for(let comment of this.comments){
               if(data.id == comment.id){
                 comment.totalReplies = comment.replies.length;
                 comment.viewReplies = data.viewReplies ? true : false;
                 comment.isReplyClicked = data.isReplyClicked ? true : false;
                 for(let tmpReply of data.replies){
                   for(let reply of comment.replies){
                     if(tmpReply.id == reply.id){
                        comment.totalReplies += reply.replies.length;
                        reply.viewReplies = tmpReply.viewReplies ? true : false;
                        reply.isReplyClicked = tmpReply.isReplyClicked ? true : false;
                     }
                   }
                 }
               }
             }
           }
         }else{
             for(let comment of this.comments){
                 comment.totalReplies = comment.replies.length;
                   for(let reply of comment.replies){
                        comment.totalReplies += reply.replies.length;
                   }
                 }
         }
         this.$forceUpdate();
				})
    },
    /**
    * Add a comment
    * @param isReply boolean | flag to check if (reply or comment)
    * @param data object | data from the reply components
    */
    addComments (isReply, data) {
      let formData = new FormData();
      let process = false;
      if(isReply){
        formData.append('name', data.name);
        formData.append('comment_description', data.comment_description);
        formData.append('parent_comment_id', data.parent_comment_id);
        process = true;
      }else{
      if(this.$refs.vForm.validate()){
        formData.append('name', this.name);
				formData.append('comment_description', this.comment_description);
        process = true;

      }
      }

      if(process){
        this.axiosCall('/api/comments/add', 'POST', formData)
				.then((res) => {
         console.log(res);
         this.$refs.vForm.reset();
         this.getComments();
				})
      }
    }
  }
};
</script>
