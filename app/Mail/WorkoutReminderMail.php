<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class WorkoutReminderMail extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $programInfo;
    public $dayName;

    /**
     * Create a new message instance.
     */
    public function __construct($user, $programInfo, $dayName)
    {
        $this->user = $user;
        $this->programInfo = $programInfo;
        $this->dayName = $dayName;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: ' Pengingat Latihan Harian Optimove!',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.workout_reminder',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
