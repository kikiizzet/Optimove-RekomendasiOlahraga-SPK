<?php

namespace App\Http\Controllers;

use App\Models\Testimonial;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TestimonialController extends Controller
{
    /**
     * Store a newly created testimonial in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'content' => 'required|string|max:300',
            'rating'  => 'required|integer|min:1|max:5',
        ]);

        $userId = Auth::id();

        // Check if user already has a testimonial (pending or published)
        $hasTestimonial = Testimonial::where('user_id', $userId)->exists();

        if ($hasTestimonial) {
            return back()->withErrors(['content' => 'Anda hanya dapat mengirimkan satu testimoni. Silakan hapus testimoni Anda sebelumnya terlebih dahulu jika ingin membuat yang baru.']);
        }

        Testimonial::create([
            'user_id'      => $userId,
            'content'      => $request->content,
            'rating'       => $request->rating,
            'is_published' => false,
        ]);

        return back()->with('success', 'Testimoni berhasil dikirim dan menunggu persetujuan admin!');
    }

    /**
     * Remove the specified testimonial from storage.
     */
    public function destroy(Testimonial $testimonial)
    {
        if ($testimonial->user_id !== Auth::id()) {
            abort(403);
        }

        $testimonial->delete();

        return back()->with('success', 'Testimoni berhasil dihapus.');
    }
}
