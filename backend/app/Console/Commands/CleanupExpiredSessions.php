<?php

namespace App\Console\Commands;

use App\Models\DiditVerification;
use Illuminate\Console\Command;

class CleanupExpiredSessions extends Command
{
    protected $signature = 'didit:cleanup';
    protected $description = 'Clean up expired Didit verification sessions';

    public function handle()
    {
        $expiredSessions = DiditVerification::where('created_at', '<', now()->subDays(7))
                                            ->whereIn('status', ['Pending', 'Not Started'])
                                            ->delete();

        $this->info("Deleted {$expiredSessions} expired verification sessions.");
    }
}
