<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Testimonial;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TestimonialAdminController extends Controller
{
    /**
     * Display a listing of all testimonials for admin review.
     */
    public function index()
    {
        $testimonials = Testimonial::with('user:id,name,email,profile_photo')
            ->latest()
            ->get()
            ->map(function ($item) {
                if ($item->user && $item->user->profile_photo) {
                    $item->user->profile_photo_url = asset('storage/' . $item->user->profile_photo);
                } else {
                    if ($item->user) {
                        $item->user->profile_photo_url = null;
                    }
                }
                return $item;
            });

        return Inertia::render('Admin/Testimonials', [
            'testimonials' => $testimonials,
        ]);
    }

    /**
     * Approve the specified testimonial to be published on landing page.
     */
    public function approve(Testimonial $testimonial)
    {
        $testimonial->update([
            'is_published' => true,
            'published_at' => now(),
        ]);

        return back()->with('success', 'Testimoni berhasil disetujui dan diterbitkan!');
    }

    /**
     * Delete/Reject the specified testimonial.
     */
    public function destroy(Testimonial $testimonial)
    {
        $testimonial->delete();

        return back()->with('success', 'Testimoni berhasil dihapus.');
    }
}
