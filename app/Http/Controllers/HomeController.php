<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\MerchantDetails;
use App\Models\User;
use App\Models\Onepage_Banner_Space;
use App\Models\Onepage_SocialLinks;
use App\Models\Onepage_WebsiteTheme;
use App\Models\Cards;
use App\Models\OnePage_BasicInformation;
use App\Models\OnepageLocation;
use App\Models\OnepageLocateUs;
use App\Models\OnepageGallery;
use App\Models\OnepageGalleryImage;
use App\Models\OnepageContactView;
use App\Models\OnePageContact;
use App\Models\OnepageTermsCondition;
use App\Models\OnepageProfileSetting;
use App\Models\UserPoints;
use App\Models\Tokens;
use App\Models\UserToken;
use App\Models\Coupon;
use App\Models\Rewards;
use App\Models\UserWallet;
use App\Models\WalletStructure;
use App\Models\MembershipLog;
use App\Models\MembershipStructure;
use App\Models\Ebooklets;
use App\Models\Booklets;
use App\Models\BookletContent;
use App\Models\TokenRedeem;
use DB;
use Illuminate\Support\Facades\Validator;


class HomeController extends Controller
{
    public function onePageWebsite($m_id){
        $merchant = MerchantDetails::where('user_id', $m_id)->first();
        if(!$merchant){
            return redirect()->back()->with('error', 'Merchant not found');
        }
        $api_code = $merchant->api_header;
        return view('welcome',compact('m_id','api_code'));
    }

    public function homescreen()
    {
        $merchant_id= 15657;
        $user_id= 9;
        $homebrandlogo = Onepage_WebsiteTheme::select('brand_logo_image','display_brand_logo_name','brand_logo_alignment')->where('merchant_id', $merchant_id)->first();
        if (!$homebrandlogo) {
            return response()->json([
                'error' => true,
                'message' => 'Brand logo not found',
                'data' => null
            ]);
        }
        $data = [];
        $data['homebrandlogo'] = $homebrandlogo->brand_logo_image;
        $data['display_brand_logo_name'] = $homebrandlogo->display_brand_logo_name;
        $data['brand_logo_alignment'] = $homebrandlogo->brand_logo_alignment;
        $merchant_name = MerchantDetails::select('business_name')->where('user_id', $merchant_id)->first();
        $cards=Cards::select('cards.current_points', 'cards.current_wallet_balance')->where('cards.merchant_id', $merchant_id)->where('cards.user_id', $user_id)->first();
        $homebannersData = Onepage_Banner_Space::select('banner_image')->where('merchant_id', $merchant_id)->where('status', 1)->where('hide_show',1)->get();
        if(count($homebannersData) > 0){
            $banner_images = $homebannersData->pluck('banner_image')->all();
            $data['banners'] = [
                'banner_image' => $banner_images,
            ];
        }
        $data['merchant_name'] = $merchant_name->business_name;
        $data['cards'] = $cards;
        return response()->json([
            'error' => false,
            'message' => 'Home screen data',
            'data' => $data,
        ]);
        
    }
    public function creditbalance()
    {
        $merchant_id= 15657;
        $user_id= 9;
        $balance =Cards::select('cards.current_points','user_points.valid_till','user_points.original_points','user_points.original_bill_date','user_points.bill_amount','user_points.transaction_id','user_points.M_account')
        ->leftJoin('users', 'cards.user_id', '=', 'users.id')
        ->leftJoin('user_points', function ($join) {
            $join->on('cards.user_id', '=', 'user_points.user_id')
                 ->on('cards.merchant_id', '=', 'user_points.merchant_id');
        })
        ->where('cards.merchant_id', $merchant_id)
        ->where('cards.user_id', $user_id)->get();
        return response()->json([
            'error' => false,
            'message' => 'Balance',
            'creditbalance' => $balance,
        ]); 

    }
    public function walletbalance()
    {
        $merchant_id= 15657;
        $user_id= 9;
        $waletbalance = Cards::select('cards.current_wallet_balance', 'user_wallet.validity', 'user_wallet.original_points', 'wallet_structure.name')
        ->leftJoin('users', 'cards.user_id', '=', 'users.id')
        ->leftJoin('user_wallet', 'user_wallet.user_id', '=', 'cards.user_id')
        ->leftJoin('wallet_structure', 'user_wallet.structure_foreign_id', '=', 'wallet_structure.id')
        ->where('cards.merchant_id', $merchant_id)
        ->where('cards.user_id', $user_id)
        ->get();
        
        return response()->json([
            'error' => false,
            'message' => 'Balance',
            'walletbalance' => $waletbalance,
        ]);


    }
    public function couponscart(Request $request)
    {
        $merchant_id= 15657;
        // $user_id= 9;//local
        $user_id =15867532;//test
        $token_id= $request->token_id;
        
        $select = [
            'user_token.token_id',
            'tokens.name',
            'user_token.use_limit',
            'user_token.token_code',
            'user_token.token_valide'
        ];

        if(!empty($token_id)){
            $select = [
                'tokens.name',
                'tokens.valid_on',
                'tokens.timing',
                'tokens.terms',
                'user_token.token_valide'
            ];
        }
        
        $data = [];
        $couponcart=UserToken::select($select)
        ->leftjoin('users','user_token.user_id','=','users.id')
        ->leftjoin('tokens', 'user_token.token_id', '=', 'tokens.id')
        ->where('user_token.merchant_id', $merchant_id)
        ->where('user_token.user_id', $user_id);
        if(!empty($token_id)){
            $couponcart->where('user_token.token_id', $token_id);
        }

        $couponcart = $couponcart->get();
        if(count($couponcart)>0){
            $data['couponcart'] = $couponcart;
        }
        return response()->json([
            'error' => false,
            'message' => 'Coupon cart',
            'data' => $data
        ]);


    }
    public function couponhold(Request $request)
    {
        $merchant_id= 15657;
        // $user_id= 9;
        $user_id= 15867532;
        $token_id= $request->token_id;

        $select = [
            'user_token.token_id',
            'tokens.name',
            'user_token.use_limit',
            'user_token.token_code',
            'user_token.token_valide',
            'user_token.temp_hold'
        ];

        if(!empty($token_id)){
            $select = [
                'tokens.name',
                'tokens.valid_on',
                'tokens.timing',
                'tokens.terms',
                'user_token.token_valide'
            ];
        }
        
        $data = [];
        $currentDate = date('Y-m-d');
        $onHoldCoupons = UserToken::select($select)
        ->leftJoin('users', 'user_token.user_id', '=', 'users.id')
        ->leftJoin('tokens', 'user_token.token_id', '=', 'tokens.id')
        ->where('user_token.merchant_id', $merchant_id)
        ->where('user_token.user_id', $user_id)
        ->where('user_token.temp_hold', 1)
        ->where('user_token.token_valide', '>=', $currentDate);
        if (!empty($token_id)) {
            $onHoldCoupons->where('user_token.token_id', $token_id);
        }

        $onHoldCoupons = $onHoldCoupons->get();
        if (count($onHoldCoupons) > 0) {
            $data['onHoldCoupons'] = $onHoldCoupons;
        }
        
        return response()->json([
            'error' => false,
            'message' => 'Hold Coupon cart',
            'data' => $data
        ]);


    }
    
    public function rewards(Request $request)
    {
        $merchant_id = 15657;
        // $user_id = 9;//local
        $user_id =15867532;//test
        $rewards_id =$request->rewards_id;
        $select=[
            'rewards.name',
            'rewards.valid_till',
            'coupon.coupon_code',
            'coupon.foreign_id',

        ];
        if(!empty($rewards_id)){
            $select=[
                'rewards.name',
                'rewards.valid_on',
                'rewards.timing',
                'rewards.terms',
                'rewards.valid_till',
            ];
        }
        $data = [];
        $rewards = Rewards::select($select)
            ->leftJoin('coupon', 'rewards.id', '=', 'coupon.foreign_id')
            ->leftJoin('users', 'coupon.user_id', '=', 'users.id')
            ->where('coupon.merchant_id', $merchant_id)
            ->where('coupon.user_id', $user_id);
            if(!empty($rewards_id)){
                $rewards->where('rewards.id', $rewards_id);
            }
            $rewards = $rewards->get();
            if(count($rewards)>0){
                $data['rewards'] = $rewards;
            }
        return response()->json([
            'error' => false,
            'message' => 'Rewards',
            'data' => $data
        ]);
    }
    public function memebershippackage(Request $request)
    {
        $merchant_id=15657;
        // $user_id=9;
        $user_id =15867532;//test
        $membership_id=$request->membership_id;
        $select=[
            'membership_structure.name',
            'membership_log.end_date',
            'membership_log.selling_price',
            'membership_log.membership_id'
            
        ];
        if(!empty($membership_id)){
            $select=[
                'membership_structure.name',
                'membership_log.end_date',
                'membership_log.start_date',
                'membership_log.membership_id'
            ];
        }
        $data = [];
        $currentDate = date('Y-m-d');
        $membership=MembershipLog::select($select)
        ->leftJoin('users', 'membership_log.user_id', '=', 'users.id')
        ->leftJoin('membership_structure', 'membership_log.membership_id', '=', 'membership_structure.id')
        ->where('membership_log.user_id', $user_id);
        if(!empty($membership_id)){
            $membership->where('membership_log.membership_id', $membership_id);
        }
        $membership = $membership->get();
        if (count($membership) > 0) {
            $membership->each(function ($item) use ($currentDate) {
                if ($item->end_date < $currentDate) {
                    $item->expired = true;
                } else {
                    $item->expired = false;

                }
            });
            $membership = $membership->sortBy('expired')->values();
            $data['membership'] = $membership;
        }
        return response()->json([
            'error' => false,
            'message' => 'Membership Package',
            'data' => $data,
        ]);
    }

    public function eWalletissue(Request $request)
    {
        $user_id = 9;
        $membership_id = $request->membership_id;
        $ewallet_issued = DB::table('membership_log')
            ->where('user_id', $user_id)
            ->where('membership_id', $membership_id)
            ->pluck('ewallet_issued')
            ->first();
        
        // $ewallet_ids = explode(',', $ewallet_issued);
        $ewallet_ids = array_map('trim', explode(',', $ewallet_issued));
        $ewallet = Ebooklets::select('ebooklets.name', 'ebooklets.credit', 'ebooklets.credit_validity')
            ->whereIn('ebooklets.id', $ewallet_ids)
            ->get();
        
        return response()->json([
            'error' => false,
            'message' => 'E-Wallet',
            'data' => $ewallet,
        ]);
    }

    public function bookletissue(Request $request)
    {
        $user_id = 9;
        $membership_id = $request->membership_id;
        $booklet_issued= DB::table('membership_log')
            ->where('user_id', $user_id)
            ->where('membership_id', $membership_id)
            ->pluck('booklet_issued')
            ->first();
        // $booklet_ids = explode(',', $booklet_issued);
        $booklet_ids = array_map('trim', explode(',', $booklet_issued));
        $booklet = Booklets::select('booklets.name','booklets.id')
            ->whereIn('booklets.id', $booklet_ids)
            ->get();
        
        return response()->json([
            'error' => false,
            'message' => 'Booklet',
            'data' => $booklet,
        ]);

    }
    
    public function bookletcoupon(Request $request)
    {
        $user_id = 9;
        $membership_id = $request->membership_id;
        $booklets_id = $request->booklets_id;
        $token_id =$request->token_id;
        $select = [
            'tokens.name',
            'booklet_content.uses',
            'user_token.token_code',
            'user_token.token_valide',
            'tokens.valid_on',
            'tokens.id'
        ];
        if(!empty($token_id)){
            $select = [
                'tokens.name',
                'tokens.valid_on',
                'tokens.timing',
                'tokens.terms',
                'booklet_content.uses',
                'user_token.token_code',
                'user_token.token_valide'
            ];
        }
        $data = [];
        $booklet_coupon = BookletContent::select($select)
            ->join('membership_log', function($join) use ($user_id, $membership_id, $booklets_id) {
                $join->on('membership_log.booklet_issued', 'LIKE', DB::raw("CONCAT('%', booklet_content.bookletid, '%')"))
                    ->where('membership_log.user_id', $user_id)
                    ->where('membership_log.membership_id', $membership_id);
            })
            ->join('tokens', 'tokens.id', '=', 'booklet_content.tokenid')
            ->join('user_token', 'booklet_content.tokenid', '=', 'user_token.token_id')
            ->where('booklet_content.bookletid', $booklets_id);
           
        if(!empty($token_id)){
            $booklet_coupon->where('tokens.id', $token_id);
        }
        $booklet_coupon = $booklet_coupon->get();
        if(count($booklet_coupon)>0){
            $data['booklet_coupon'] = $booklet_coupon;
        }

        return response()->json([
            'error' => false,
            'message' => 'Booklet Coupon',
            'data' => $data,
        ]);
    }

    public function couponsRedeem(Request $request)
    {
        $user_id =9;
        $membership_id=$request->membership_id;

        $coupon_redeem = TokenRedeem::select('token_redeem.token_code', 'tokens.name', DB::raw('count(token_redeem.token_code) as redeem_count'))
        ->join('membership_log', 'token_redeem.user_id', '=', 'membership_log.user_id')
        ->join('tokens', 'token_redeem.token_id', '=', 'tokens.id')
        ->where('membership_log.user_id', $user_id)
        ->where('membership_log.membership_id', $membership_id)
        ->groupBy('token_redeem.token_code', 'tokens.name')
        ->get();
        $data = [];
        if(count($coupon_redeem)>0){
            $data['coupon_redeem'] = $coupon_redeem;
        }
        return response()->json([
            'error' => false,
            'message' => 'Coupon Redeem',
            'data' => $data,
        ]);
    }
    public function about()
    {
        $merchant_id= 15657;
        $homebannersData = Onepage_Banner_Space::select('banner_image')->where('merchant_id', $merchant_id)->where('status', 1)->where('hide_show',1)->get();
        if(count($homebannersData) > 0){
            $banner_images = $homebannersData->pluck('banner_image')->all();
            $data['banners'] = [
                'banner_image' => $banner_images,
            ];
        }
        $about =Onepage_BasicInformation::select('heading','content')->where('merchant_id', $merchant_id)->where('status',1)->where('hide_show',1)->first();
        if($about){
            $data['about'] = [
                'heading' => $about->heading,
                'content' => $about->content,
            ];
        }
        $location=OnepageLocation::select('heading')->where('merchant_id', $merchant_id)->where('status', 1)->where('hide_show', 1)->first();
        if($location){
            $location_Heading = $location->heading;
        }
        $locateus=OnepageLocateUs::select('name_outlet','mobile','email','location','location_link','image')->where('merchant_id', $merchant_id)->where('status', 1)->where('hide_show', 1)->get();
        if($locateus->isNotEmpty()){
            foreach($locateus as $key => $value){
                $locateus[$key] = [
                    'name_outlet' => $value->name_outlet,
                    'mobile' => $value->mobile,
                    'email' => $value->email,
                    'location' => $value->location,
                    'location_link' => $value->location_link,
                    'image' => $value->image,
                ];
            }
            $data['location_Heading'] = $location_Heading;
            $data['locateus'] = $locateus;
        }
        $galery=OnepageGallery::select('heading')->where('status',1)->where('hide_show', 1)->where('merchant_id', $merchant_id)->first();
        $gallery_images = OnepageGalleryImage::select('gallery_image')->where('merchant_id', $merchant_id)->where('status', 1)->where('hide_show', 1)->get();
        if ($gallery_images->isNotEmpty()) {
            $gallery_images = $gallery_images->pluck('gallery_image')->all();
        }
    
        $galleryData = [];
        if ($galery) {
            $galleryData['heading'] = $galery->heading;
        }
        if (!empty($gallery_images)) {
            $galleryData['images'] = $gallery_images;
        }
        return response()->json([
            'error' => false,
            'message' => 'About',
            'data' => $data,
            'gallery' => $galleryData
        ]);


    }
    
    public function contact()
    {
        $merchant_id= 15657;
        $contact =OnepageContactView::select('heading')->where('merchant_id', $merchant_id)->where('status', 1)->where('hide_show', 1)->first();
        if($contact){
            $contact = [
                'heading' => $contact->heading,
            ];
        }
        return response()->json([
            'error' => false,
            'message' => 'Contact view',
            'contact' => $contact,
        ]);

    }

    public function contactsubmit(Request $request)
    {
        // $merchant_id=$request->merchant_id;
        $merchant_id= 15657;
        $name=$request->name;
        $mobile=$request->mobile;
        $email=$request->email;
        $message=$request->message;
        $contact = new OnePageContact();
        $contact->merchant_id = $merchant_id;
        $contact->name = $name;
        $contact->mobile = $mobile;
        $contact->email = $email;
        $contact->message = $message;
        $contact->priority=0;
        $contact->status = 1;
        $contact->hide_show = 1;
        $contact->date = date('Y-m-d H:i:s');
        $contact->time = date('H:i:s');
        $contact->save();
        return response()->json([
            'error' => false,
            'message' => 'Thankyou for Contacting us!',
        ]);


    }
    public function termscondition()
    {
        $merchant_id= 15657;
        $termscondition =OnepageTermsCondition::select('heading', 'description')->where('merchant_id', $merchant_id)->where('status', 1)->first(); 
        if($termscondition){
            $termscondition = [
                'heading' => $termscondition->heading,
                'description' => $termscondition->description,
            ];
        }
        return response()->json([
            'error' => false,
            'message' => 'Terms Condition',
            'termscondition' => $termscondition,
        ]);

    }
    public function accountInfo()
    {
        $merchant_id = 15657;
        $accountheading = OnepageProfileSetting::where('merchant_id', $merchant_id)->where('status', 1)->first();

        if (is_null($accountheading)) {
            return response()->json([
                'error' => true,
                'message' => 'No records found',
                'accountheading' => null,
            ]);
        }
        $transformedData = [
            'name' => [
                'display_full_name_permission' => $accountheading->display_full_name_permission,
                'full_name_dynamic_name' => $accountheading->full_name_dynamic_name,
            ],
            'email' => [
                'display_email_permission' => $accountheading->display_email_permission,
                'email_dynamic_name' => $accountheading->email_dynamic_name,
            ],
            'gender' => [
                'display_gender_permission' => $accountheading->display_gender_permission,
                'gender_dynamic_name' => $accountheading->gender_dynamic_name,
            ],
            'address' => [
                'display_address_permission' => $accountheading->display_address_permission,
                'address_dynamic_name' => $accountheading->address_dynamic_name,
            ],
            'pincode' => [
                'display_pincode_permission' => $accountheading->display_pincode_permission,
                'pincode_dynamic_name' => $accountheading->pincode_dynamic_name,
            ],
            'city' => [
                'display_city_permission' => $accountheading->display_city_permission,
                'city_dynamic_name' => $accountheading->city_dynamic_name,
            ],
            'region' => [
                'display_region_permission' => $accountheading->display_region_permission,
                'region_dynamic_name' => $accountheading->region_dynamic_name,
            ],
            'birthday' => [
                'display_birthday_permission' => $accountheading->display_birthday_permission,
                'birthday_dynamic_name' => $accountheading->birthday_dynamic_name,
            ],
            'marital_status' => [
                'display_marital_status_permission' => $accountheading->display_marital_status_permission,
                'marital_status_dynamic_name' => $accountheading->marital_status_dynamic_name,
            ],
            'bank' => [
                'display_bank_name_permission' => $accountheading->display_bank_name_permission,
                'bank_name' => $accountheading->bank_name,
                'display_bank_account_number_permission' => $accountheading->display_bank_account_number_permission,
                'bank_account_number' => $accountheading->bank_account_number,
            ],
            'mobile' => [
                'display_mobile_number_permission' => $accountheading->display_mobile_number_permission,
                'mobile_number_dynamic_name' => $accountheading->mobile_number_dynamic_name,
            ],
            'gst' => [
                'display_gst_permission' => $accountheading->display_gst_permission,
                'gst_dynamic_name' => $accountheading->gst_dynamic_name,
            ],
           'pan' => [
                'display_pan_permission' => $accountheading->display_pan_permission,
                'pan_dynamic_name' => $accountheading->pan_dynamic_name,
            ],
        ];

        return response()->json([
            'error' => false,
            'message' => 'Account Info',
            'accountheading' => $transformedData,
        ]);
    }
    public function infodata()
    {
        $merchant_id= 15657;
        $user_id= 15882661; //for test
        // $user_id= 9; //for local

        $infodata = User::select('users.image','users.name','cards.gender','users.email','users.mobile','cards.dob','cards.marital','cards.doa','cards.address','cards.gstin','cards.pan','cards.bank_name','cards.bank_account_number','users.pincode','users.country','users.state','cards.region','cards.city')
        ->join('cards', 'users.id', '=', 'cards.user_id')
        ->where('users.id', $user_id)
        ->where('cards.merchant_id', $merchant_id)
        ->first();
        return response()->json([
            'error' => false,
            'message' => 'Info Data',
            'infodata' => $infodata,
        ]);

    }
    
    public function editinfo(Request $request)
    {
        $merchant_id = 15657;
        $user_id = 15882661; //test userid
        // $user_id = 9;

        $rules = [
            'merchant_id'=>'required',
            'name' => 'required',
            'email' => 'required|email',
            'mobile' => 'required|numeric'
        ];
        $validator = Validator::make($request->all(), $rules);
        
        if ($validator->fails()) {
            return response()->json([
                'error' => true,
                'message' => 'Validation Failed',
                'errors' => $validator->errors()
            ]);
        }

        $user = User::find($user_id);
        if (!$user) {
            return response()->json([
                'error' => true,
                'message' => 'User not found'
            ]);
        }

        if ($request->hasFile('profile_image')) {
            $image = $request->file('profile_image');
            $imageext = strtoupper($image->getClientOriginalExtension());
            $allowedExtensions = ['JPEG', 'PNG', 'JPG'];
    
            if (in_array($imageext, $allowedExtensions)) {
                $img_extension = $image->getClientOriginalExtension();
                $img_name = pathinfo($image->getClientOriginalName(), PATHINFO_FILENAME);
                $filename = $img_name . rand(10000, 99999) . '.' . $img_extension;
                $path = public_path('/profile/images');
                $image->move($path, $filename);
    
                $s3 = AWS::get('s3');
                $data = $s3->putObject([
                    'Bucket'     => 'ewardsmain',
                    'Key'        => 'merchants/businessimage/' . $filename,
                    'SourceFile' => $path . $filename,
                    'ACL'        => 'public-read',
                ]);
    
                $profile_logo_image = $data['ObjectURL'];
                $user->image = $profile_logo_image;
                unlink($path . $filename);
            } else {
                return response()->json([
                    'error' => true,
                    'message' => 'Only JPEG, PNG, JPG formats are accepted'
                ]);
            }
        }

        $user->name = $request->name;
        $user->email = $request->email;
        $user->mobile = $request->mobile;
        $user->country = $request->country;
        $user->pincode = $request->pincode;
        $user->state = $request->state;
        $user->save();

        $profile = Cards::where('merchant_id', $merchant_id)->where('user_id', $user_id)->first();
        if (!$profile) {
            return response()->json([
                'error' => true,
                'message' => 'Profile not found'
            ]);
        }

        $profile->gender = $request->gender;
        $profile->dob = $request->dob;
        $profile->marital = $request->marital;
        $profile->doa = $request->doa;
        $profile->address = $request->address;
        $profile->gstin = $request->gstin;
        $profile->pan = $request->pan;
        $profile->city = $request->city;
        $profile->bank_name = $request->bank_name;
        $profile->bank_account_number = $request->bank_account_number;
        $profile->region = $request->region;
        $profile->save();

        return response()->json([
            'error' => false,
            'message' => 'Info Data Updated Successfully',
            'user' => $user,
            'profile' => $profile,
        ]);
    }



    //count homescreen coouponcart,rewardsmenu,memebership package
    public function getDataCounts(Request $request)
    {
        $merchant_id = 15657;
        // $user_id = 9; //local
        $user_id =15867532;//test
        $rewards_id = $request->rewards_id;
        $membership_id = $request->membership_id;
        
        $couponCount = $this->getActiveCouponCount($merchant_id, $user_id);
        $rewardsCount = $this->getActiveRewardsCount($merchant_id, $user_id, $rewards_id);
        $membershipCount = $this->getActiveMembershipCount($user_id, $membership_id);
        
        return response()->json([
            'error' => false,
            'message' => 'Data Counts',
            'data' => [
                'active_coupon_count' => $couponCount,
                'active_rewards_count' => $rewardsCount,
                'active_membership_count' => $membershipCount
            ]
        ]);
    }

    private function getActiveCouponCount($merchant_id, $user_id)
    {
        $select = [
            'user_token.token_id',
            'tokens.name',
            'user_token.use_limit',
            'user_token.token_code',
            'user_token.token_valide'
        ];

        if (!empty($token_id)) {
            $select = [
                'tokens.name',
                'tokens.valid_on',
                'tokens.timing',
                'tokens.terms',
                'user_token.token_valide'
            ];
        }
        
        $couponcart = UserToken::select($select)
            ->leftJoin('users', 'user_token.user_id', '=', 'users.id')
            ->leftJoin('tokens', 'user_token.token_id', '=', 'tokens.id')
            ->where('user_token.merchant_id', $merchant_id)
            ->where('user_token.user_id', $user_id);
            
        if (!empty($token_id)) {
            $couponcart->where('user_token.token_id', $token_id);
        }

        $couponcart = $couponcart->get();
        return count($couponcart);
    }

    private function getActiveRewardsCount($merchant_id, $user_id, $rewards_id = null)
    {
        $select = [
            'rewards.name',
            'rewards.valid_till',
            'coupon.coupon_code',
            'coupon.foreign_id'
        ];

        if (!empty($rewards_id)) {
            $select = [
                'rewards.name',
                'rewards.valid_on',
                'rewards.timing',
                'rewards.terms',
                'rewards.valid_till'
            ];
        }
        
        $rewards = Rewards::select($select)
            ->leftJoin('coupon', 'rewards.id', '=', 'coupon.foreign_id')
            ->leftJoin('users', 'coupon.user_id', '=', 'users.id')
            ->where('coupon.merchant_id', $merchant_id)
            ->where('coupon.user_id', $user_id);
            
        if (!empty($rewards_id)) {
            $rewards->where('rewards.id', $rewards_id);
        }

        $currentDate = date('Y-m-d');
        $rewards = $rewards->get();
        $activeRewards = $rewards->filter(function ($reward) use ($currentDate) {
            return $reward->valid_till >= $currentDate;
        });

        return count($activeRewards);
    }

    private function getActiveMembershipCount($user_id, $membership_id = null)
    {
        $select = [
            'membership_structure.name',
            'membership_log.end_date',
            'membership_log.selling_price',
            'membership_log.membership_id'
        ];

        if (!empty($membership_id)) {
            $select = [
                'membership_structure.name',
                'membership_log.end_date',
                'membership_log.start_date',
                'membership_log.membership_id'
            ];
        }
        
        $membership = MembershipLog::select($select)
            ->leftJoin('users', 'membership_log.user_id', '=', 'users.id')
            ->leftJoin('membership_structure', 'membership_log.membership_id', '=', 'membership_structure.id')
            ->where('membership_log.user_id', $user_id);
            
        if (!empty($membership_id)) {
            $membership->where('membership_log.membership_id', $membership_id);
        }

        $currentDate = date('Y-m-d');
        $membership = $membership->get();
        $activeMembership = $membership->filter(function ($item) use ($currentDate) {
            return $item->end_date >= $currentDate;
        });

        return count($activeMembership);
    }

    public function referral_programview(Request $request)
    {
        $merchant_id=1644378;
        $user_id=15870381;
        // $user_id=$request->user_id;
        // $merchant_id=$request->merchant_id;
        $refercards=Cards::select('cards.name','cards.dob','cards.created_at','u2.mobile','u2.email','u2.id')
        ->leftJoin('users','cards.refer_by','=','users.id')
        ->leftJoin('users as u2', 'cards.user_id', '=', 'u2.id')
        ->where('cards.refer_by', $user_id)
        ->where('cards.merchant_id', $merchant_id)
        ->orderBy('cards.created_at', 'desc')
        ->get();
        if($refercards->isEmpty()){
            return response()->json([
                'error' => true,
                'msg' => 'No Referrals Found'
            ]);
        }
        return response()->json([
            'error' => false,
            'data' => $refercards
        ]);
       
    }
    public function referErn(Request $request)
    {
        $merchant_id=$request->merchant_id;
        $refer =OnepageProfileSetting::select('referral_permission', 'referral_dynamic_name')->where('merchant_id', $merchant_id)->where('referral_permission', 1)->where('status', 1)->first();
        if($refer){
            $refer = [
                'referral_permission' => $refer->referral_permission,
                'referral_dynamic_name' => $refer->referral_dynamic_name,
            ];
        }
        return response()->json([
            'error' => false,
            'message' => 'Referral Permission',
            'refer' => $refer,
        ]);
       
    }
}
