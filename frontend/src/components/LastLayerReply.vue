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
      <template v-for="(comment) in replies">

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
  },
  data: () => ({
    name: null,
    comment_description: null
  }),
  mounted() {
  },
  props : {
        replies: null,
        ParentID: null,
        viewReplies: null,
        isReply: null,
        index: null
  },
   watch: {
          viewReplies: {
            handler () {
                this.$forceUpdate();
            },
            deep: true,
          },
        },
  methods : {
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
