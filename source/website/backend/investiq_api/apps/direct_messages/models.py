from django.conf import settings
from django.db import models


class DirectConversation(models.Model):
    participant_one = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='direct_conversations_one'
    )
    participant_two = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='direct_conversations_two'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('participant_one', 'participant_two')
        ordering = ['-updated_at']

    def save(self, *args, **kwargs):
        # Ensure stable ordering for uniqueness
        if self.participant_one_id and self.participant_two_id:
            if self.participant_one_id > self.participant_two_id:
                self.participant_one_id, self.participant_two_id = self.participant_two_id, self.participant_one_id
        super().save(*args, **kwargs)

    def other_user(self, user):
        if user.id == self.participant_one_id:
            return self.participant_two
        return self.participant_one

    def __str__(self):
        return f"DM {self.participant_one_id} <-> {self.participant_two_id}"


class DirectMessage(models.Model):
    conversation = models.ForeignKey(DirectConversation, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='direct_messages')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"DM {self.conversation_id} by {self.sender_id}"
