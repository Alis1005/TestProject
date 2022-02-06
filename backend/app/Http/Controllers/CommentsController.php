<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use App\Comment as Comment;

class CommentsController extends Controller
{
    /**
	 * Fetch all comments
	 */
    public function getComments()
    {
        $all_comments = Comment::orderBy('created_at', 'DESC')->get();
        $comments = Comment::where('parent_comment_id', NULL)->orderBy('created_at', 'DESC')->get();

        foreach ($comments as $comment) {
            $comment->replies = $this->getReplies($all_comments, $comment->id);
            foreach ( $comment->replies as $reply) {
                $reply->replies = $this->getReplies($all_comments, $reply->id);
            }
        }

        return response()->json($comments, 200);
    }
    /**
	 * Get all replies
	 */
    private function getReplies($all_comments, $id)
	{
		$result = [];
            foreach ($all_comments as $data) {
                if ($data->parent_comment_id == $id) {
                    $result[] = $data;
                }
            }
            
		return $result;
	}
    /**
	 * Add a comment
	 * @param  Request $request
	 */
    public function addComment(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required ',
            'comment_description' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }else{
            $data = $request->all();

              $comment =  Comment::create([
                    'name' => $data['name'],
                    'comment_description' => $data['comment_description']
              ]);

              if(isset($data['parent_comment_id'])){
                $comment->parent_comment_id = $data['parent_comment_id'];
              }
              $comment->save();

            return response()->json('Success!', 200);
        }
    }
}
