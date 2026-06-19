<?php
$src = imagecreatefrompng('public/images/Background.png');
$w = imagesx($src);
$h = imagesy($src);

// Bottom left corner (300x300)
$dst_left = imagecreatetruecolor(300, 300);
// Preserve transparency if any
imagealphablending($dst_left, false);
imagesavealpha($dst_left, true);
imagecopy($dst_left, $src, 0, 0, 0, $h - 300, 300, 300);
imagepng($dst_left, 'C:/Users/LENOVO LOQ/.gemini/antigravity-ide/brain/1e501737-d7fd-4322-a39b-12ab39bfcc42/debug_bottom_left.png');

// Bottom right corner (300x300)
$dst_right = imagecreatetruecolor(300, 300);
imagealphablending($dst_right, false);
imagesavealpha($dst_right, true);
imagecopy($dst_right, $src, 0, 0, $w - 300, $h - 300, 300, 300);
imagepng($dst_right, 'C:/Users/LENOVO LOQ/.gemini/antigravity-ide/brain/1e501737-d7fd-4322-a39b-12ab39bfcc42/debug_bottom_right.png');

echo "Done cropped. Width: $w, Height: $h\n";
?>
