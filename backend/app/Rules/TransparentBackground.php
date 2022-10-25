<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;

class TransparentBackground implements Rule
{
    protected $attribute;
    /**
     * Create a new rule instance.
     *
     * @return void
     */
    public function __construct($attribute = 'image')
    {
        $this->attribute = $attribute;
    }

    /**
     * Determine if the validation rule passes.
     *
     * @param  string  $attribute
     * @param  mixed  $value
     * @return bool
     */
    public function passes($attribute, $value)
    {
        $img_check = imagecreatefrompng($value);
        return $this->check_transparent($img_check);
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        return 'Your '.$this->attribute.' must be transparent';
    }

    function check_transparent($im) {

        $width = imagesx($im); // Get the width of the image
        $height = imagesy($im); // Get the height of the image

        // We run the image pixel by pixel and as soon as we find a transparent pixel we stop and return true.
        for($i = 0; $i < $width; $i++) {
            for($j = 0; $j < $height; $j++) {
                $rgba = imagecolorat($im, $i, $j);
                if(($rgba & 0x7F000000) >> 24) {
                    return true;
                }
            }
        }

        // If we dont find any pixel the function will return false.
        return false;
    }
}
