<template>
  <v-card
  v-if="viewReplies"
    class="mx-auto"
    max-width="600"
    elevation="0"
  >
  <v-card-text v-if="isReply">
        Write a reply
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
          label="Write your reply"
        ></v-textarea>
        
    <v-btn
      class="ml-4"
      dense
      color="primary"
      @click="addComments(false, '')"
    >
    Reply
    </v-btn>
      </v-col>
    </v-row>
    </v-form>
    </v-card-text>
    <v-card-text class="mt-2" v-if="replies.length > 0">
    <span class="font-weight-bold" style="font-size:12px;">
        Replies
    </span>
      <v-list>
      <template v-for="(comment, index) in replies">

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

            <p class="grey--text mt-1 ml-9" style="line-height:20px;">{{comment.comment_description}}</p>
            <span class="ml-14 blue--text"
             style="font-size: 12px; cursor:pointer; max-width: 30px;"
              @click="clickReply(index)">
              Reply
             </span>

              <span class="ml-4 blue--text"
              style="font-size: 12px;  max-width: 80px; "
               >
               {{comment.replies.length}}
               <v-icon
               small
               style="cursor:pointer;"
               @click="clickViewReply(index)"
               color="blue">
               mdi-chat-outline
               </v-icon>
             </span>

            <!-- Components here -->
              <lastreply
              :isReply ="comment.isReplyClicked"
              :ParentID="comment.id"
              :viewReplies="comment.viewReplies"
              :replies="comment.replies"
              :index ="index"
              ></lastreply>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-list>
    </v-card-text>
  </v-card>
</template>
<script>
export default {
  components: {
       'lastreply' : () => import('../components/LastLayerReply.vue')
  },
  data: () => ({
    name: null,
    comment_description: null
  }),
  mounted() {
  },
  props : {
        trigger: null,
        replies: null,
        ParentID: null,
        viewReplies: null,
        isReply: null,
        index: null
  },
   watch: {
          trigger: {
            handler () {
                this.$forceUpdate();
            },
            deep: true,
          },
        },
  methods : {
    /**
    * Open reply with reply fields using eventhub
    * @param index integer | comment index
    */
    clickReply(index){
        let data = {};
        data.replyIndex = index;
        data.parent_comment_id = this.ParentID;
        data.index = this.index;
        this.eventHub.$emit('OpenLastReply',data);
    },
    /**
    * Open a reply using eventhub
    * @param index integer | comment index
    */
    clickViewReply(index){
        let data = {};
        data.replyIndex = index;
        data.parent_comment_id = this.ParentID;
        data.index = this.index;
        this.eventHub.$emit('ViewLastReply',data);
    }, 
    /**
    * add a comment using eventhub
    * @param index integer | comment index
    */
    addComments () {
     if(this.$refs.vForm.validate()){
         let data = {};
         data.name = this.name;
         data.comment_description = this.comment_description;
         data.parent_comment_id = this.ParentID;
         this.eventHub.$emit('Reply',data);
         this.$refs.vForm.reset();
      }
    }
  }
};
</script>
