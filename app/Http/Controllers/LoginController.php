<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\MerchantDetails;
use App\Models\User;
use App\Models\Onepage_Banner_Space;
use App\Models\Onepage_SocialLinks;
use App\Models\Onepage_WebsiteTheme;
use App\Models\Cards;
use Illuminate\Support\Facades\Validator;


class LoginController extends Controller
{
    public function loginview($m_id)
    {
        $m_id = base64_decode($m_id);
        $brandlogo = MerchantDetails::select('business_image','user_id','api_header','business_name')->where('user_id', $m_id)->first();
        if (!$brandlogo) {
            return response()->json([
                'error' => true,
                'message' => 'Unauthorize Access',
                'data' => null
            ]);
        }
        $data = [];
        $links = [];
        $banner_images = [];

        $data['merchant_details'] = $brandlogo;
        $data['brand_logo'] = $brandlogo->business_image;
        $bannersData = Onepage_Banner_Space::select('links', 'banner_image')->where('merchant_id', $m_id)->where('status', 1)->where('hide_show',1)->get();
        if(count($bannersData) > 0){
            $links = $bannersData->pluck('links')->map(function ($link) {
                return trim($link); 
            })->all();
            $banner_images = $bannersData->pluck('banner_image')->all();
            $data['banners'] = [
                'links' => $links,
                'banner_image' => $banner_images,
            ];
        }
        $socialLinks = Onepage_SocialLinks::select('heading','facebook_link','instagram_link','twitter_link','zomato_link','linkedin_link')->where('merchant_id', $m_id)->where('status',1)->where('hide_show',1)->first();
        if($socialLinks){
            $data['social_links'] = [
                'heading' => $socialLinks->heading,
                'facebook_link' => $socialLinks->facebook_link,
                'instagram_link' => $socialLinks->instagram_link,
                'twitter_link' => $socialLinks->twitter_link,
                'zomato_link' => $socialLinks->zomato_link,
                'linkedin_link' => $socialLinks->linkedin_link,
            ];
        }
        $themeData = Onepage_WebsiteTheme::select('primary_color', 'secondary_color', 'font_primary_color','font_secondary_color')->where('merchant_id', $m_id)->where('status', 1)->where('hide_show', 1)->first();
        if($themeData){
            $data['theme'] = [
                'primary_color' => $themeData->primary_color,
                'secondary_color' => $themeData->secondary_color,
                'font_primary_color' => $themeData->font_primary_color,
                'font_secondary_color' => $themeData->font_secondary_color,
            ];
        }
        return response()->json([
            'error' => false,
            'message' => 'Login view data',
            'data' => $data,
            'merchant_id' => $brandlogo->user_id,
            'api_header' => $brandlogo->api_header
        ]);
    }
    
   
}
