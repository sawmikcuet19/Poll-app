package com.poll.Poll_Spring_Boot.controllers.use;

import com.poll.Poll_Spring_Boot.dtos.*;
import com.poll.Poll_Spring_Boot.services.user.PollService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/user")
@CrossOrigin("*")
public class PollController {

    private final PollService pollService;

    @PostMapping("/poll")
    public ResponseEntity<?> postPoll(@RequestBody PollDTO pollDTO) {
        PollDTO createdPollDTO = pollService.postPoll(pollDTO);

        if (createdPollDTO != null) {
            return ResponseEntity.status(HttpStatus.CREATED).body(createdPollDTO);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @DeleteMapping("/poll/{id}")
    public ResponseEntity<Void> deletePoll(@PathVariable Long id) {
        pollService.deletePoll(id);
        return ResponseEntity.ok(null);
    }

    @GetMapping("/polls")
    public ResponseEntity<List<PollDTO>> getAllPolls() {

        return ResponseEntity.ok(pollService.getAllPolls());
    }

    @GetMapping("/my-polls")
    public ResponseEntity<List<PollDTO>> getMyPolls() {

        return ResponseEntity.ok(pollService.getMyPolls());
    }

    @PostMapping("/poll/like/{id}")
    public ResponseEntity<?> giveLikeToPoll(@PathVariable Long id) {
        LikesDTO likesDTO = pollService.giveLikeToPoll(id);

        if (likesDTO != null) {
            return ResponseEntity.status(HttpStatus.OK).body(likesDTO);
        } else {
            // If likesDTO is null, it could mean 'unliked' or 'error'. Assuming 'unliked'
            // is successful operation.
            // We can return 200 OK with a message or just build().
            return ResponseEntity.status(HttpStatus.OK).build();
        }
    }

    @PostMapping("/poll/comment")
    public ResponseEntity<?> postCommentOnPoll(@RequestBody CommentDTO commentDTO) {
        CommentDTO dto = pollService.postCommentOnPoll(commentDTO);

        if (dto != null) {
            return ResponseEntity.status(HttpStatus.OK).body(dto);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PostMapping("/poll/vote")
    public ResponseEntity<?> postVoteOnPole(@RequestBody VoteDTO voteDTO) {
        try {
            return ResponseEntity.ok(pollService.postVoteOnPole(voteDTO));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @GetMapping("/poll/{id}")
    public ResponseEntity<?> getPollById(@PathVariable Long id) {

        return ResponseEntity.ok(pollService.getPollById(id));
    }
}
