<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

use Intervention\Image\Facades\Image;

class ImageController extends Controller
{
    public function thumb(Request $request, $path = null, $img = null){
        $user = ($request->u) ? (int) $request->u . '/' : '';
        $subpath = ($request->s) ? $request->s.'/' : '';
        $width = ($request->w) ? (int)$request->w : null;
        $height = ($request->h) ? (int)$request->h : null;
        $rotation = ($request->r) ? (int)$request->r : null;
        $path = $path.'/'.$subpath.$user.$img;

        $url = Storage::get($path);


        if(!$width && !$height && !$rotation){
            $thumb = Image::make($url);
        }else{
            if($width && $height){
                $thumb = Image::make($url)->fit($width, $height);
            }else{
                $thumb = Image::make($url)->resize($width, $height, function ($constraint) {
                    $constraint->aspectRatio();
                    $constraint->upsize();
                })->rotate($rotation);
            }
        }

        if(isset($thumb)){
            return $thumb->response('jpg');
        }
    }
}
