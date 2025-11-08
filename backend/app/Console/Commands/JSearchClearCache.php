<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;

class JSearchClearCache extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'jsearch:clear-cache';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Clear all JSearch cached results';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Clearing JSearch cache...');

        $cleared = 0;

        // Get all cache keys and filter for JSearch ones
        try {
            // For file cache driver
            if (config('cache.default') === 'file') {
                $cacheDir = storage_path('framework/cache/data');
                if (is_dir($cacheDir)) {
                    $files = glob($cacheDir . '/*/*');
                    foreach ($files as $file) {
                        if (is_file($file)) {
                            $content = file_get_contents($file);
                            if (strpos($content, 'jsearch_') !== false) {
                                unlink($file);
                                $cleared++;
                            }
                        }
                    }
                }
            }
            // For database cache driver
            elseif (config('cache.default') === 'database') {
                $cleared = \DB::table(config('cache.stores.database.table', 'cache'))
                    ->where('key', 'like', '%jsearch_%')
                    ->delete();
            }
            // For redis/memcached
            else {
                // Simple approach: try to get all keys with jsearch prefix
                $pattern = '*jsearch_*';
                $keys = [];

                if (method_exists(Cache::getStore(), 'connection')) {
                    $keys = Cache::getStore()->connection()->keys($pattern);
                }

                foreach ($keys as $key) {
                    // Remove cache prefix if present
                    $cleanKey = str_replace(config('cache.prefix') . ':', '', $key);
                    Cache::forget($cleanKey);
                    $cleared++;
                }
            }

            $this->info("✓ Cleared {$cleared} JSearch cache entries");

            // Also clear config cache to ensure env variables are fresh
            $this->call('config:clear');

            return 0;

        } catch (\Exception $e) {
            $this->error('Error clearing cache: ' . $e->getMessage());
            return 1;
        }
    }
}
