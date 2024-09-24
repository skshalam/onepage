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
use App\Models\RedeemPoints;
use App\Models\WalletRedeem;
use App\Models\CountryCodes;
use App\Models\Countries;
use App\Models\CitisNew;
use App\Models\MerchantRegion;
use App\Models\Master;
use DB;
use Auth;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;
use DateTime;


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
        // $merchant_id= 15657;
        // $user_id= 9;
        $user = JWTAuth::parseToken()->authenticate();
        $user_id = $user->id;
        // Get the merchant_id from the JWT payload
        $merchant_id = JWTAuth::parseToken()->getPayload()->get('merchant_id');
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
        $master = Master::where('id',1)->first();
        $merchant_name = MerchantDetails::select('business_name')->where('user_id', $merchant_id)->first();
        $cards=Cards::select('cards.current_points', 'cards.current_wallet_balance')->where('cards.merchant_id', $merchant_id)->where('cards.user_id', $user_id)->first();
        $homebannersData = Onepage_Banner_Space::select('banner_image','hide_show')->where('merchant_id', $merchant_id)->where('status', 1)->where('hide_show',1)->get();
        if(count($homebannersData) > 0){
            $banner_images = $homebannersData->pluck('banner_image')->all();
            $data['banners'] = [
                'banner_image' => $banner_images,
            ];
        }
        $data['merchant_name'] = $merchant_name->business_name;
        $data['cards'] = $cards;
        $data['ewards_url'] = $master->ewards_url;
        return response()->json([
            'error' => false,
            'message' => 'Home screen data',
            'data' => $data,
        ]);
        
    }

    public function getTotalCreditBalance(){
        $user = JWTAuth::parseToken()->authenticate();
        $user_id = $user->id;
        // Get the merchant_id from the JWT payload
        $merchant_id = JWTAuth::parseToken()->getPayload()->get('merchant_id');

        $total_bal = Cards::where('merchant_id', $merchant_id)->where('user_id', $user_id)->get('current_points');
        
        return response()->json([
            'error' => false,
            'message' => 'total_bal',
            'total_bal' => $total_bal,
        ]); 
    }

    public function creditbalance(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $user_id = $user->id;
        // Get the merchant_id from the JWT payload
        $merchant_id = JWTAuth::parseToken()->getPayload()->get('merchant_id');
        $current_points = Cards::where('merchant_id', $merchant_id)->where('user_id', $user_id)->value('current_points');

        $creditbalance_query = "SELECT
                        Type,
                        Valid_Till,
                        Invoice_Number,
                        Points,
                        DATE_FORMAT(Billing_Date, '%e') AS Billing_Day,
                        DATE_FORMAT(Billing_Date, '%b') AS Billing_Month,
                        DATE_FORMAT(Billing_Date, '%Y') AS Billing_Year,
                        Billing_Amount,
                        Transaction_id,
                        Account,
                        Credit_Name,
                        feedback_id,
                        pos_billing_dump_new_id,
                        usefor,
                        ebooklet_report_id,
                        custom_ewallet_marker
                    FROM (
                        SELECT
                            CASE
                                WHEN up.valid_till < CURRENT_DATE THEN 'Expired'
                                ELSE 'Earned'
                            END AS Type,
                            up.valid_till AS Valid_Till,
                            up.bill_no AS Invoice_Number,
                            up.original_points AS Points,
                            up.original_bill_date AS Billing_Date,
                            up.bill_amount AS Billing_Amount,
                            up.transaction_id AS Transaction_id,
                            up.M_account AS Account,
                            CASE
                                WHEN up.custom_ewallet_marker = 1 AND up.ebooklet_report_id IS NOT NULL AND up.ebooklet_report_id != 0 THEN 'eWallet Credits'
                                WHEN up.usefor != 0 AND up.pos_billing_dump_new_id = 0 THEN 'Loyalty Credits'
                                WHEN up.feedback_id != 0 THEN 'Feedback Credits'
                                WHEN up.pos_billing_dump_new_id != 0 THEN 'Bonus Credits'
                                ELSE 'Other Credits'
                            END AS Credit_Name,
                            up.feedback_id AS feedback_id,
                            up.pos_billing_dump_new_id as pos_billing_dump_new_id,
                            up.usefor as usefor,
                            up.ebooklet_report_id as ebooklet_report_id,
                            up.custom_ewallet_marker as custom_ewallet_marker
                        FROM user_points up
                        WHERE up.user_id = ".$user_id."
                        AND up.merchant_id = ".$merchant_id."
                        UNION ALL
                        SELECT
                            'Redeemed' AS Type,
                            NULL AS Valid_Till,
                            rp.bill_no AS Invoice_Number,
                            rp.point_redeem AS Points,
                            CONCAT(rp.date, ' ', rp.time) AS Billing_Date,
                            rp.bill_amount AS Billing_Amount,
                            NULL AS Transaction_id,
                            rp.M_account AS Account,
                            'Redeem Credits' AS Credit_Name,
                             'null' AS feedback_id,
                             'null' AS pos_billing_dump_new_id,
                             'null' AS usefor,
                             'null' AS ebooklet_report_id,
                             'null' AS custom_ewallet_marker
                        FROM redeem_points rp
                        WHERE rp.user_id = ".$user_id."
                        AND rp.merchant_id = ".$merchant_id."
                    ) AS combined_results
                    ORDER BY Billing_Date DESC";
        $creditbalance_obj = DB::select($creditbalance_query);    
        
        foreach ($creditbalance_obj as $item) {
            $day = $item->Billing_Day;
            $month = $item->Billing_Month;
            $year = $item->Billing_Year;
            $suffix = 'th';
            if ($day == 1 || $day == 21 || $day == 31) {
                $suffix = 'st';
            } elseif ($day == 2 || $day == 22) {
                $suffix = 'nd';
            } elseif ($day == 3 || $day == 23) {
                $suffix = 'rd';
            }
            $item->Formatted_Billing_Date = "{$day}{$suffix} {$month} {$year}";
        }

        return response()->json([
            'error' => false,
            'message' => 'Balance',
            'creditbalance' => $creditbalance_obj,
            'current_points' => $current_points
        ]);

    
    }

    // public function creditbalance(Request $request)
    // {
    //     // $merchant_id= 15657;
    //     // $user_id= 9;
    //     $user = JWTAuth::parseToken()->authenticate();
    //     $user_id = $user->id;
    //     // Get the merchant_id from the JWT payload
    //     $merchant_id = JWTAuth::parseToken()->getPayload()->get('merchant_id');
    //     $balance =UserPoints::select('user_points.valid_till','user_points.original_points','user_points.original_bill_date','user_points.bill_amount','user_points.transaction_id','user_points.M_account','user_points.bill_no as invoice_no','user_points.custom_ewallet_marker','user_points.ebooklet_report_id','user_points.usefor','user_points.pos_billing_dump_new_id','user_points.feedback_id')
    //     ->where('user_points.merchant_id', $merchant_id)
    //     ->where('user_points.user_id', $user_id);
    //     // ->leftJoin('redeem_points', function ($join) {
    //     //     $join->on('user_points.user_id', '=', 'redeem_points.user_id')
    //     //          ->on('user_points.merchant_id', '=', 'redeem_points.merchant_id');
    //     // });
    //     if(!empty($request->to_date) && !empty($request->from_date)){
    //         $balance = $balance->whereBetween('user_points.original_bill_date', [$request->to_date, $request->from_date]);
    //     }
    //     $balance = $balance->limit(10)->get();
    //     $redeem_data = RedeemPoints::select('bill_no')->where('user_id', $user_id)->where('merchant_id', $merchant_id)->get();
    //     $currentDate = date('Y-m-d');
    //     $balance = $balance->map(function ($item) use ($currentDate) {
    //         $item['is_expired'] = $currentDate > $item->valid_till;
    //         if (preg_match('/\d{2}:\d{2}:\d{2}/', $item->invoice_no, $matches)) {
    //             $timePart = $matches[0]; 
    //             $dateTime = DateTime::createFromFormat('H:i:s', $timePart);
    //             if ($dateTime) {
    //                 $formattedTime = $dateTime->format('g:i A'); // Format to 12-hour time with AM/PM
    //                 $item['original_time'] = $timePart; // 24-hour format
    //                 $item['formatted_time'] = $formattedTime; // 12-hour format
    //             }
    //         } else {
    //             $item['original_time'] = '';
    //             $item['formatted_time'] = '';
    //         }

    //         if ($item->custom_ewallet_marker == 1 && (empty($item->ebooklet_report_id) || $item->ebooklet_report_id == 0)) {
    //             $item['name'] = 'eWallet Credits';
    //         } elseif (!empty($item->usefor) && $item->usefor != 0 && $item->pos_billing_dump_new_id == 0) {
    //             $item['name'] = 'Loyalty Credits';
    //         } elseif (!empty($item->feedback_id) && $item->feedback_id != 0) {
    //             $item['name'] = 'Feedback Credits';
    //         } elseif (!empty($item->pos_billing_dump_new_id) && $item->pos_billing_dump_new_id != 0) {
    //             $item['name'] = 'Bonus Credits';
    //         }
    //         return $item;
    //     });
    //     if (!empty($request->credit_type)) {
    //         $creditType = intval($request->credit_type);
    //         $balance = $balance->filter(function ($item) use ($creditType) {
    //             switch ($creditType) {
    //                 case 1:
    //                     return $item['name'] == 'eWallet Credits';
    //                 case 2:
    //                     return $item['name'] == 'Loyalty Credits';
    //                 case 3:
    //                     return $item['name'] == 'Bonus Credits';
    //                 case 4:
    //                     return $item['name'] == 'Feedback Credits';
    //                 default:
    //                     return true;
    //             }
    //         });
    //     }
    //     if(!empty($request->is_expired)){
    //         $isExpiredFilter = filter_var($request->input('is_expired'), FILTER_VALIDATE_BOOLEAN);
    //         $balance = $balance->filter(function ($item) use ($isExpiredFilter) {
    //             return $item['is_expired'] === $isExpiredFilter;
    //         });
    //     }
    //     // echo"<pre>";
    //     // print_r($balance); exit;
    //     return response()->json([
    //         'error' => false,
    //         'message' => 'Balance',
    //         'creditbalance' => $balance,
    //     ]); 

    // }

    public function getTotalWalletBalance(){
        $user = JWTAuth::parseToken()->authenticate();
        $user_id = $user->id;
        // Get the merchant_id from the JWT payload
        $merchant_id = JWTAuth::parseToken()->getPayload()->get('merchant_id');

        $total_wlbal = Cards::where('merchant_id', $merchant_id)->where('user_id', $user_id)->get('current_wallet_balance');
        
        return response()->json([
            'error' => false,
            'message' => 'total_bal',
            'total_bal' => $total_wlbal,
        ]); 
    }
    public function walletbalance(Request $request)
    {
        // $merchant_id= 15657;
        // $user_id= 9;
        $user = JWTAuth::parseToken()->authenticate();
        $user_id = $user->id;
        // Get the merchant_id from the JWT payload
        $merchant_id = JWTAuth::parseToken()->getPayload()->get('merchant_id');
        $waletbalance = Cards::select('cards.current_wallet_balance', 'user_wallet.validity', 'user_wallet.original_points', 'wallet_structure.name')
        ->leftJoin('users', 'cards.user_id', '=', 'users.id')
        ->leftJoin('user_wallet', 'user_wallet.user_id', '=', 'cards.user_id')
        ->leftJoin('wallet_structure', 'user_wallet.structure_foreign_id', '=', 'wallet_structure.id')
        ->where('cards.merchant_id', $merchant_id)
        ->where('cards.user_id', $user_id);
        if(!empty($request->redem_chk) && $request->redem_chk == 1){
            $waletbalance = $waletbalance->leftJoin('wallet_redeem', 'wallet_redeem.temp_wallet_redeem_id', '=', 'wallet_structure.id')
        ->leftJoin('wallet_structure as ws2', 'wallet_redeem.temp_wallet_redeem_id', '=', 'ws2.id');
        }
        if(!empty($request->to_date) && !empty($request->from_date)){
            $waletbalance = $waletbalance->whereBetween('user_wallet.validity', [$request->to_date, $request->from_date]);
        }
        $waletbalance= $waletbalance->get();
        $currentDate = date('Y-m-d');
        $waletbalance = $waletbalance->map(function ($item) use ($currentDate,$request) {
            $item['is_expired'] = $currentDate > $item->validity;
            // $combinedValue = $item->current_wallet_balance + $item->original_points;
            if (!empty($request->redem_chk) && $request->redem_chk == 1) {
                $combinedValue = $item->current_wallet_balance - $item->original_points;
            } else {
                $combinedValue = $item->current_wallet_balance + $item->original_points;
            }
            $item['value'] = $combinedValue;
            return $item;
        });
        if(!empty($request->is_expired)){
            $isExpiredFilter = filter_var($request->input('is_expired'), FILTER_VALIDATE_BOOLEAN);
            $waletbalance = $waletbalance->filter(function ($item) use ($isExpiredFilter) {
                return $item['is_expired'] === $isExpiredFilter;
            });
        }
        return response()->json([
            'error' => false,
            'message' => 'Balance',
            'walletbalance' => $waletbalance,
        ]);


    }
    public function couponscart(Request $request)
    {
        // $merchant_id= 15657;
        // // $user_id= 9;//local
        // $user_id =15867532;//test
        $user = JWTAuth::parseToken()->authenticate();
        $user_id = $user->id;
        // Get the merchant_id from the JWT payload
        $merchant_id = JWTAuth::parseToken()->getPayload()->get('merchant_id');
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
                'user_token.use_limit',
                'user_token.token_code',
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
        if(!empty($token_id)){
            $couponcart[0]['token_valid_on'] = $this->getDaysAccoToValidon($couponcart[0]['valid_on']);
        }
        if (!empty($couponcart[0]['timing'])) {
            $couponcart[0]['timing_on'] = $this->formatTiming($couponcart[0]['timing']);
        }
        if(count($couponcart)>0){
            $data['couponcart'] = $couponcart;
        }
        return response()->json([
            'error' => false,
            'message' => 'Coupon cart',
            'data' => $data
        ]);


    }
    private function getDaysAccoToValidon($validOn){
        $days = '';
        if(!empty($validOn)){
            $days_arr = [];
            $validOn = explode(',', $validOn);
            foreach ($validOn as $key => $value) {
                switch ($value) {
                    case '1':
                        $days_arr[] = 'Sun';
                        break;
                    case '2':
                        $days_arr[] = 'Mon';
                        break;
                    case '3':
                        $days_arr[] = 'Tue';
                        break;
                    case '4':
                        $days_arr[] = 'Wed';
                        break;
                    case '5':
                        $days_arr[] = 'Thu';
                        break;
                    case '6':
                        $days_arr[] = 'Fri';
                        break;
                    case '7':
                        $days_arr[] = 'Sat';
                        break;
                    default:
                        break;
                }
            }
            $days = implode(', ', $days_arr);
        }
        
        return $days;
    }
    private function formatTiming($timing)
    {
        $times = explode(',', $timing);
        $formattedTimes = array_map(function($time) {
            return date('h:i A', strtotime(str_replace('.', ':', $time)));
        }, $times);
        return implode(' to ', $formattedTimes);
    }
    public function couponhold(Request $request)
    {
        // $merchant_id= 15657;
        // // $user_id= 9;
        // $user_id= 15867532;
        $user = JWTAuth::parseToken()->authenticate();
        $user_id = $user->id;
        // Get the merchant_id from the JWT payload
        $merchant_id = JWTAuth::parseToken()->getPayload()->get('merchant_id');
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
                'user_token.token_code',
                'user_token.use_limit',
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
        if(!empty($token_id)){
            $onHoldCoupons[0]['token_valid_on'] = $this->getDaysAccoToValidon($onHoldCoupons[0]['valid_on']);
        }
        if (!empty($onHoldCoupons[0]['timing'])) {
            $onHoldCoupons[0]['timing_on'] = $this->formatTiming($onHoldCoupons[0]['timing']);
        }
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
        // $merchant_id = 15657;
        // // $user_id = 9;//local
        // $user_id =15867532;//test
        $user = JWTAuth::parseToken()->authenticate();
        $user_id = $user->id;
        // Get the merchant_id from the JWT payload
        $merchant_id = JWTAuth::parseToken()->getPayload()->get('merchant_id');
        $rewards_id =$request->rewards_id;
        $select=[
            'rewards.name',
            'rewards.valid_till',
            'coupon.coupon_code',
            'coupon.foreign_id as rewards_id',

        ];
        if(!empty($rewards_id)){
            $select=[
                'rewards.name',
                'rewards.valid_on',
                'rewards.timing',
                'rewards.terms',
                'coupon.coupon_code',
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
            if(!empty($rewards_id)){
                $rewards[0]['token_valid_on'] = $this->getDaysAccoToValidon($rewards[0]['valid_on']);
            }
            if (!empty($rewards[0]['timing'])) {
                $rewards[0]['timing_on'] = $this->formatTiming($rewards[0]['timing']);
            }
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
        // $merchant_id=15657;
        // $user_id =15867532;//test

        $user = JWTAuth::parseToken()->authenticate();
        $user_id = $user->id;
        // Get the merchant_id from the JWT payload
        $merchant_id = JWTAuth::parseToken()->getPayload()->get('merchant_id');

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
        ->where('membership_log.user_id', $user_id)
        ->where('membership_structure.merchant_id', $merchant_id);    
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
        // $user_id = 9;
        $user = JWTAuth::parseToken()->authenticate();
        $user_id = $user->id;
        $merchant_id = JWTAuth::parseToken()->getPayload()->get('merchant_id');
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
            ->where('ebooklets.merchant_id', $merchant_id)
            ->get();
        
        return response()->json([
            'error' => false,
            'message' => 'E-Wallet',
            'data' => $ewallet,
        ]);
    }

    public function bookletissue(Request $request)
    {
        // $user_id = 9;
        $user = JWTAuth::parseToken()->authenticate();
        $user_id = $user->id;
        $merchant_id = JWTAuth::parseToken()->getPayload()->get('merchant_id');
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
            ->where('booklets.merchant_id', $merchant_id)
            ->get();
        
        return response()->json([
            'error' => false,
            'message' => 'Booklet',
            'data' => $booklet,
        ]);

    }
    
    public function bookletcoupon(Request $request)
    {
        // $user_id = 9;
        $user = JWTAuth::parseToken()->authenticate();
        $user_id = $user->id;
        $merchant_id = JWTAuth::parseToken()->getPayload()->get('merchant_id');
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
            ->where('booklet_content.bookletid', $booklets_id)
            ->where('user_token.user_id', $user_id)
            ->where('user_token.merchant_id', $merchant_id);

           
        if(!empty($token_id)){
            $booklet_coupon->where('tokens.id', $token_id);
        }
        $booklet_coupon = $booklet_coupon->get();
        if(!empty($token_id)){
            $booklet_coupon[0]['token_valid_on'] = $this->getDaysAccoToValidon($booklet_coupon[0]['valid_on']);
        }
        if (!empty($booklet_coupon[0]['timing'])) {
            $booklet_coupon[0]['timing_on'] = $this->formatTiming($booklet_coupon[0]['timing']);
        }
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
        // $user_id =9;
        $user = JWTAuth::parseToken()->authenticate();
        $user_id = $user->id;
        $membership_id=$request->membership_id;
        $merchant_id = JWTAuth::parseToken()->getPayload()->get('merchant_id');
        $coupon_redeem = TokenRedeem::select('token_redeem.token_code', 'tokens.name', DB::raw('count(token_redeem.token_code) as redeem_count'))
        ->join('membership_log', 'token_redeem.user_id', '=', 'membership_log.user_id')
        ->join('tokens', 'token_redeem.token_id', '=', 'tokens.id')
        ->where('membership_log.user_id', $user_id)
        ->where('membership_log.membership_id', $membership_id)
        ->where('token_redeem.merchant_id', $merchant_id)
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
        // $merchant_id= 15657;
        $merchant_id = JWTAuth::parseToken()->getPayload()->get('merchant_id');
        // $homebannersData = Onepage_Banner_Space::select('banner_image')->where('merchant_id', $merchant_id)->where('status', 1)->where('hide_show',1)->get();
        // if(count($homebannersData) > 0){
        //     $banner_images = $homebannersData->pluck('banner_image')->all();
        //     $data['banners'] = [
        //         'banner_image' => $banner_images,
        //     ];
        // }
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
        if (!empty($galleryData)) {
        $data['gallery'] = $galleryData;
    }
        return response()->json([
            'error' => false,
            'message' => 'About',
            'data' => $data,
            // 'gallery' => $galleryData
        ]);


    }
    
    public function contact()
    {
        // $merchant_id= 15657;
        $merchant_id = JWTAuth::parseToken()->getPayload()->get('merchant_id');
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
        // $merchant_id= 15657;
        $merchant_id = JWTAuth::parseToken()->getPayload()->get('merchant_id');
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
        // $merchant_id= 15657;
        $merchant_id = JWTAuth::parseToken()->getPayload()->get('merchant_id');
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
        // $merchant_id = 15657;
        $merchant_id = JWTAuth::parseToken()->getPayload()->get('merchant_id');
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
        // $merchant_id= 15657;
        // $user_id= 15882661; //for test
        // $user_id= 9; //for local

        $user = JWTAuth::parseToken()->authenticate();
        $user_id = $user->id;
        // Get the merchant_id from the JWT payload
        $merchant_id = JWTAuth::parseToken()->getPayload()->get('merchant_id');

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
        // $merchant_id = 15657;
        // $user_id = 15882661; //test userid
        // $user_id = 9;
        $user = JWTAuth::parseToken()->authenticate();
        $user_id = $user->id;
        // Get the merchant_id from the JWT payload
        $merchant_id = JWTAuth::parseToken()->getPayload()->get('merchant_id');
        
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
        $user = JWTAuth::parseToken()->authenticate();
        $user_id = $user->id;
        // dd($user_id);
        // Get the merchant_id from the JWT payload
        $merchant_id = JWTAuth::parseToken()->getPayload()->get('merchant_id');
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
        // $merchant_id=1644378;
        // $user_id=15870381;
        $user = JWTAuth::parseToken()->authenticate();
        $user_id = $user->id;
        // Get the merchant_id from the JWT payload
        $merchant_id = JWTAuth::parseToken()->getPayload()->get('merchant_id');
        $refercards=Cards::select('u2.name','cards.dob','cards.created_at','u2.mobile','u2.email','u2.id')
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
        // $merchant_id=$request->merchant_id;
        // $user = JWTAuth::parseToken()->authenticate();
        // $user_id = $user->id;
        // Get the merchant_id from the JWT payload
        $merchant_id = JWTAuth::parseToken()->getPayload()->get('merchant_id');
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
    public function countries(Request $request)
    {
        $merchant_id = JWTAuth::parseToken()->getPayload()->get('merchant_id');
        $countries = countries::get();
        return response()->json([
            'error' => false,
            'message' => 'all countries',
            'countries' => $countries,
        ]);
        
    }
    public function cities(Request $request)
    {
        $merchant_id = JWTAuth::parseToken()->getPayload()->get('merchant_id');
        $country = $request->country;
        $rules=[
            'merchant_id'=>'Required',
            'country'=>'Required',
          ];
          $validator = Validator::make($request->all(), $rules);
        
          if ($validator->fails()) {
              return response()->json([
                  'error' => true,
                  'message' => 'Validation Failed',
                  'errors' => $validator->errors()
              ]);
          }else{
            $cities = CitisNew::get();
            return response()->json([
                'error' => false,
                'message' => 'all cities',
                'cities' => $cities,
            ]);
          } 

    }

    public function gettingregion(Request $request)
    {

      $merchant_id = JWTAuth::parseToken()->getPayload()->get('merchant_id');
      $city = $request->city;
      $rules = [
        'city' => 'required',
        ];
        $validator = Validator::make($request->all(), $rules);
    
        if ($validator->fails()) {
            return response()->json([
                'error' => true,
                'message' => 'Validation Failed',
                'errors' => $validator->errors()
            ]);
        }
      $region = MerchantRegion::select('id','region')->where('city',$city)->where('merchant_id',$merchant_id)->orderBy('region')->get();
      unset($merchant_id,$city);
      if(count($region)>0){
        return response()->json([
            'error' => false,
            'region' => $region,
        ]);
      }else{
        $region = 'No city Found';
        return response()->json([
            'error' => true,
            'region' => $region,
        ]);
      } 
    }
    public function themecolor()
    {
        $merchant_id = JWTAuth::parseToken()->getPayload()->get('merchant_id');
        $themeData = Onepage_WebsiteTheme::select('primary_color', 'secondary_color', 'font_primary_color','font_secondary_color')->where('merchant_id', $merchant_id)->where('status', 1)->where('hide_show', 1)->first();
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
            'message' => 'Theme Data',
            'data' => $data,
        ]);
    }
    
}
