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
use App\Models\ExpireUserPoints;
use App\Models\ExpireUserWallet;
use App\Models\State;
use App\Models\UserStamps;
use App\Models\WlOutlets;
use App\Models\MerchantLoginMenuItem;
use App\Models\RewardsExceptionDates;
use App\Models\UserReward;
use App\Models\Parameter;
use App\Models\MULtable;
use App\Models\LoginWiseParameter;
use App\Models\LoginWiseParameterDaily;
use DB;
use Auth;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
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


    public function creditbalance(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $user_id = $user->id;
        // Get the merchant_id from the JWT payload
        $merchant_id = JWTAuth::parseToken()->getPayload()->get('merchant_id');
        $current_points = Cards::where('merchant_id', $merchant_id)->where('user_id', $user_id)->value('current_points');

        // Pagination parameters
        $page_number = $request->page_number; 
        $limit = 10; 
        $offset = ($page_number - 1) * $limit;
        // dd($offset);
        // $total_entries_query = "
        //     SELECT COUNT(*) as total_entries
        //     FROM (
        //         SELECT 1
        //         FROM user_points up
        //         WHERE up.user_id = ".$user_id."
        //         AND up.merchant_id = ".$merchant_id."
        //         UNION ALL
        //         SELECT 1
        //         FROM redeem_points rp
        //         WHERE rp.user_id = ".$user_id."
        //         AND rp.merchant_id = ".$merchant_id."
        //     ) as total_count_query
        // ";
        // $total_entries = DB::select($total_entries_query)[0]->total_entries;
        // $total_pages = ceil($total_entries / $limit); 
        // Main query with pagination (LIMIT and OFFSET)
        $creditbalance_query = "
            SELECT
                Type,
                Valid_Till,
                Invoice_Number,
                Points,
                DATE_FORMAT(Billing_Date, '%e') AS Billing_Day,
                DATE_FORMAT(Billing_Date, '%b') AS Billing_Month,
                DATE_FORMAT(Billing_Date, '%Y') AS Billing_Year,
                Billing_Date,
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
                    'Earned' AS Type,
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
                UNION ALL
                SELECT
                    'Expired' AS Type,
                    eup.valid_till AS Valid_Till,
                    eup.bill_no AS Invoice_Number,
                    eup.original_points AS Points,
                    'null' AS Billing_Date,
                    eup.bill_amount AS Billing_Amount,
                    'null' AS Transaction_id,
                    eup.M_account AS Account,
                    'Expired Credits' AS Credit_Name,
                    'null' AS feedback_id,
                    'null' AS pos_billing_dump_new_id,
                    'null' AS usefor,
                    'null' AS ebooklet_report_id,
                    'null' AS custom_ewallet_marker
                FROM expireUserPoints eup 
                WHERE eup.user_id = ".$user_id."
                AND eup.merchant_id = ".$merchant_id."
            ) AS combined_results";
            
            $whereClauses = [];

            // Add filters based on request parameters
            if (!empty($request->credit_name)) {
                $whereClauses[] = "Credit_Name IN (" . $request->credit_name . ")";
            }
            if (!empty($request->credit_type)) {
                $whereClauses[] = "Type IN (" . $request->credit_type . ")";
            }
            if (!empty($request->start_date)) {
                $sdate = date('Y-m-d', strtotime($request->start_date));
                $whereClauses[] = "Billing_Date >= '" . $sdate . "'";
            }
            if (!empty($request->end_date)) {
                $edate = date('Y-m-d', strtotime($request->end_date));
                $whereClauses[] = "Billing_Date <= '" . $edate . "'";
            }

            // Combine the where clauses
            if (count($whereClauses) > 0) {
                $creditbalance_query .= " WHERE " . implode(' AND ', $whereClauses);
            }

            $total_entries_query = "SELECT COUNT(*) as total_entries FROM ($creditbalance_query) as total_count_query";
            $total_entries = DB::select($total_entries_query)[0]->total_entries;
            $total_pages = ceil($total_entries / $limit);
            
            $creditbalance_query = $creditbalance_query." ORDER BY Billing_Date DESC
            LIMIT ".$limit." OFFSET ".$offset;
            // dd($creditbalance_query);
        
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
            if (preg_match('/\d{2}:\d{2}:\d{2}/', $item->Invoice_Number, $matches)) {
                $timePart = $matches[0]; 
                $dateTime = DateTime::createFromFormat('H:i:s', $timePart);
                if ($dateTime) {
                    $formattedTime = $dateTime->format('g:i A'); // Format to 12-hour time with AM/PM
                    $item->original_time = $timePart; // 24-hour format
                    $item->formatted_time = $formattedTime; // 12-hour format
                }
            } else {
                $item->original_time = '';
                $item->formatted_time = '';
            }
        }

        return response()->json([
            'error' => false,
            'message' => 'Balance',
            'current_points' => $current_points,
            'creditbalance' => $creditbalance_obj,
            'total_pages' => $total_pages, 
            'total_entries' => $total_entries, 
            'current_page' => $page_number, 
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


    public function walletbalance(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $user_id = $user->id;
        $merchant_id = JWTAuth::parseToken()->getPayload()->get('merchant_id');
        $current_wallet_balance = Cards::where('merchant_id', $merchant_id)->where('user_id', $user_id)->value('current_wallet_balance');

        // Pagination parameters
        $page_number = $request->page_number;
        $limit = 10;
        $offset = ($page_number - 1) * $limit;

        // Count total entries for pagination
        $total_entries_query = "
            SELECT COUNT(*) as total_entries
            FROM (
                SELECT 1 FROM user_wallet uw WHERE uw.user_id = ".$user_id." AND uw.merchant_id = ".$merchant_id."
                UNION ALL
                SELECT 1 FROM wallet_redeem wr WHERE wr.user_id = ".$user_id." AND wr.merchant_id = ".$merchant_id."
                UNION ALL
                SELECT 1 FROM expiry_user_wallet euw WHERE euw.user_id = ".$user_id." AND euw.merchant_id = ".$merchant_id."
            ) as total_count_query
        ";
        $total_entries = DB::select($total_entries_query)[0]->total_entries;
        $total_pages = ceil($total_entries / $limit);

        // Main wallet balance query (refactored)
        $walletbalance_query = "
        Select
            Wallet_Type,
            Valid_Till,
            DATE_FORMAT(Valid_Till, '%e') AS valid_Day,
            DATE_FORMAT(Valid_Till, '%b') AS valid_Month,
            DATE_FORMAT(Valid_Till, '%Y') AS valid_Year,
            Wallet_Balance,
            Wallet_Name,
            Redemption_Date,
            Redemption_Time,
            Expiry_Date,
            Expiry_Time
        From(
                SELECT
                    'Earned' AS Wallet_Type,
                    uw.validity AS Valid_Till,
                    uw.original_points AS Wallet_Balance,
                    COALESCE(ws.name, 'Wallet Earned') AS Wallet_Name,
                    NULL AS Redemption_Date,
                    NULL AS Redemption_Time,
                    NULL AS Expiry_Date,
                    NULL AS Expiry_Time
                FROM
                    user_wallet uw
                LEFT JOIN wallet_structure ws ON uw.structure_foreign_id = ws.id
                WHERE
                    uw.merchant_id = ".$merchant_id." AND uw.user_id = ".$user_id."

                UNION ALL

                SELECT
                    'Redeemed' AS Wallet_Type,
                    NULL AS Valid_Till,
                    wr.redemption_value AS Wallet_Balance,
                    'Wallet Redeem' AS Wallet_Name,
                    wr.date AS Redemption_Date,
                    wr.time AS Redemption_Time,
                    NULL AS Expiry_Date,
                    NULL AS Expiry_Time
                FROM
                    wallet_redeem wr
                WHERE
                    wr.merchant_id = ".$merchant_id." AND wr.user_id = ".$user_id."

                UNION ALL

                SELECT
                    'Expired' AS Wallet_Type,
                    NULL AS Valid_Till,
                    euw.expiry_value AS Wallet_Balance,
                    COALESCE(ws_exp.name, 'Wallet Expired') AS Wallet_Name,
                    NULL AS Redemption_Date,
                    NULL AS Redemption_Time,
                    euw.date AS Expiry_Date,
                    euw.time AS Expiry_Time
                FROM
                    expiry_user_wallet euw
                LEFT JOIN user_wallet uw_exp ON euw.user_wallet_id = uw_exp.id
                LEFT JOIN wallet_structure ws_exp ON uw_exp.structure_foreign_id = ws_exp.id
                WHERE
                    euw.merchant_id = ".$merchant_id." AND euw.user_id = ".$user_id."
            )as combined_results";

        $whereClauses = [];

        if (!empty($request->type)) {
            $whereClauses[] = "Wallet_Type IN (" . $request->type . ")";
        }
        if (!empty($request->start_date)) {
            $sdate = date('Y-m-d', strtotime($request->start_date));
            $whereClauses[] = "Valid_Till >= '" . $sdate . "'";
        }
        if (!empty($request->end_date)) {
            $edate = date('Y-m-d', strtotime($request->end_date));
            $whereClauses[] = "Valid_Till <= '" . $edate . "'";
        }

        // Combine where clauses
        if (count($whereClauses) > 0) {
            $walletbalance_query .= " WHERE " . implode(' AND ', $whereClauses);
        }

        // Add pagination and ordering
        $walletbalance_query .= " ORDER BY Valid_Till DESC LIMIT ".$limit." OFFSET ".$offset;

        // Execute the query
        $walletbalance_obj = DB::select($walletbalance_query);

        
        foreach ($walletbalance_obj as $item) {
            $day = $item->valid_Day;
            $month = $item->valid_Month;
            $year = $item->valid_Year;
            $suffix = 'th';
            if ($day == 1 || $day == 21 || $day == 31) {
                $suffix = 'st';
            } elseif ($day == 2 || $day == 22) {
                $suffix = 'nd';
            } elseif ($day == 3 || $day == 23) {
                $suffix = 'rd';
            }
            $item->Formatted_valid_Date = "{$day}{$suffix} {$month} {$year}";
        }
        return response()->json([
            'error' => false,
            'message' => 'Balance',
            'current_wallet_balance' => $current_wallet_balance,
            'walletbalance' => $walletbalance_obj,
            'total_pages' => $total_pages,
            'total_entries' => $total_entries,
            'current_page' => $page_number,
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
        ->join('users','user_token.user_id','=','users.id')
        ->join('tokens', 'user_token.token_id', '=', 'tokens.id')
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
        ->join('users', 'user_token.user_id', '=', 'users.id')
        ->join('tokens', 'user_token.token_id', '=', 'tokens.id')
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
            ->join('coupon', 'rewards.id', '=', 'coupon.foreign_id')
            ->join('users', 'coupon.user_id', '=', 'users.id')
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
        ->join('users', 'membership_log.user_id', '=', 'users.id')
        ->join('membership_structure', 'membership_log.membership_id', '=', 'membership_structure.id')
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
        $page_number = $request->page_number;
        $limit = 10; 
        $offset = ($page_number - 1) * $limit; 
        $ewallet = Ebooklets::select('ebooklets.name', 'ebooklets.credit', 'ebooklets.credit_validity')
            ->whereIn('ebooklets.id', $ewallet_ids)
            ->where('ebooklets.merchant_id', $merchant_id)
            ->offset($offset)
            ->limit($limit)
            ->get();
        $total_records = Ebooklets::whereIn('ebooklets.id', $ewallet_ids)
        ->where('ebooklets.merchant_id', $merchant_id)
        ->count();
        $total_pages = ceil($total_records / $limit);
        
        return response()->json([
            'error' => false,
            'message' => 'E-Wallet',
            'data' => $ewallet,
            'current_page' => $page_number,
            'total_pages' => $total_pages,
            'total_records' => $total_records,
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
        $page_number = $request->page_number ;
        $limit = 10; 
        $offset = ($page_number - 1) * $limit;
        $booklet = Booklets::select('booklets.name','booklets.id')
            ->whereIn('booklets.id', $booklet_ids)
            ->where('booklets.merchant_id', $merchant_id)
            ->offset($offset)
            ->limit($limit)
            ->get();
        $total_records = Booklets::whereIn('booklets.id', $booklet_ids)
        ->where('booklets.merchant_id', $merchant_id)
        ->count();
        $total_pages = ceil($total_records / $limit);
        return response()->json([
            'error' => false,
            'message' => 'Booklet',
            'data' => $booklet,
            'current_page' => $page_number,
            'total_pages' => $total_pages,
            'total_records' => $total_records,
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

        $user = JWTAuth::parseToken()->authenticate();
        $user_id = $user->id;
        $membership_id = $request->membership_id;
        $merchant_id = JWTAuth::parseToken()->getPayload()->get('merchant_id');
        $page_number = $request->page_number; 
        $limit = 10; 
        $offset = ($page_number - 1) * $limit;
        $total_count = TokenRedeem::join('membership_log', 'token_redeem.user_id', '=', 'membership_log.user_id')
            ->where('membership_log.user_id', $user_id)
            ->where('membership_log.membership_id', $membership_id)
            ->where('token_redeem.merchant_id', $merchant_id)
            ->count();
        $total_pages = ceil($total_count / $limit);
        $coupon_redeem = TokenRedeem::select('token_redeem.token_code', 'tokens.name', DB::raw('count(token_redeem.token_code) as redeem_count'))
            ->join('membership_log', 'token_redeem.user_id', '=', 'membership_log.user_id')
            ->join('tokens', 'token_redeem.token_id', '=', 'tokens.id')
            ->where('membership_log.user_id', $user_id)
            ->where('membership_log.membership_id', $membership_id)
            ->where('token_redeem.merchant_id', $merchant_id)
            ->groupBy('token_redeem.token_code', 'tokens.name')
            ->limit($limit)  
            ->offset($offset)
            ->get();
        $data = [];
        if (count($coupon_redeem) > 0) {
            $data['coupon_redeem'] = $coupon_redeem;
        }

        return response()->json([
            'error' => false,
            'message' => 'Coupon Redeem',
            'data' => $data,
            'current_page' => $page_number,
            'total_count' => $total_count,  
            'total_pages' => $total_pages, 
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
        // $merchant_id=$merchant_id;
        // $merchant_id= 15657;
        $merchant_id = JWTAuth::parseToken()->getPayload()->get('merchant_id');
        $name=$request->name;
        $mobile=$request->mobile;
        $email=$request->email;
        $message=$request->message;
        $contact = new OnePageContact();
        $contact->merchant_id = $merchant_id;
        $contact->name = $name ?? '';
        $contact->mobile = $mobile ?? '';
        $contact->email = $email ?? '';
        $contact->message = $message ?? '';
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


        // Image processing
        if ($request->has('image')) {
            $imageInput = $request->input('image');

            // Check if the image is a valid URL
            if (filter_var($imageInput, FILTER_VALIDATE_URL)) {
                // If the input is a valid URL, save it directly
                $user->image = $imageInput;

            } else {
                // If not a valid URL, assume it's Base64 and process it as Base64-encoded data
                $base64Image = $imageInput;

                // Split the base64 string to get the file type and the actual base64 data
                @list($type, $fileData) = explode(';', $base64Image);
                @list(, $fileData) = explode(',', $fileData);

                // Decode the base64 data to binary
                $fileData = base64_decode($fileData);

                // Validate that the file type is JPEG, PNG, or JPG
                $allowedMimeTypes = ['image/jpeg', 'image/png'];
                $mimeType = mime_content_type($base64Image);

                if (!in_array($mimeType, $allowedMimeTypes)) {
                    return response()->json([
                        'error' => true,
                        'message' => 'Only JPEG, PNG, JPG formats are accepted.',
                    ], 400);
                }

                // Get the file extension (e.g., jpeg, png) from the MIME type
                $extension = explode('/', mime_content_type($base64Image))[1];

                // Create a unique file name
                $fileName = Str::random(10) . '.' . $extension;

                try {
                    // Upload to S3
                    Storage::disk('s3')->put('merchants/businessimage/' . $fileName, $fileData, 'public');

                    // Get the public URL of the uploaded file
                    $fileUrl = Storage::disk('s3')->url('merchants/businessimage/' . $fileName);

                    // Save the file URL to the user
                    $user->image = $fileUrl;

                } catch (\Exception $e) {
                    return response()->json([
                        'error' => true,
                        'message' => 'Failed to upload the image or save the URL: ' . $e->getMessage(),
                    ], 500);
                }
            }

            // Save the user with the image (either URL or base64-converted URL)
            if (!$user->save()) {
                return response()->json([
                    'error' => true,
                    'message' => 'Failed to save the image URL in the database.',
                ], 500);
            }
        }
        // Upload to S3
        
        $user->name = $request->name ?? '';
        $user->email = $request->email ?? '';
        $user->mobile = $request->mobile ?? '';
        $user->country = $request->country ?? '';
        $user->pincode = $request->pincode ?? '';
        $user->state = $request->state ?? '';
        $user->save();

        $profile = Cards::where('merchant_id', $merchant_id)->where('user_id', $user_id)->first();
        if (!$profile) {
            return response()->json([
                'error' => true,
                'message' => 'Profile not found'
            ]);
        }

        $profile->gender = $request->gender ?? '';
        // $profile->dob = $request->dob ?? '';
        $profile->dob = !empty($request->dob) ? $request->dob : null;
        $profile->marital = $request->marital ?? '';
        // $profile->doa = $request->doa ?? '';
        $profile->doa = !empty($request->doa) ? $request->doa : null;
        $profile->address = $request->address ?? '';
        $profile->gstin = $request->gstin ?? '';
        $profile->pan = $request->pan ?? '';
        $profile->city = $request->city ?? '';
        $profile->bank_name = $request->bank_name ?? '';
        $profile->bank_account_number = $request->bank_account_number ?? '';
        $profile->region = $request->region ?? '';
        $profile->save();

        return response()->json([
            'error' => false,
            'message' => 'Info Data Updated Successfully',
            'user' => $user,
            'profile' => $profile,
            // 'fileUrl' =>$fileUrl
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
            ->join('users', 'user_token.user_id', '=', 'users.id')
            ->join('tokens', 'user_token.token_id', '=', 'tokens.id')
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
            ->join('coupon', 'rewards.id', '=', 'coupon.foreign_id')
            ->join('users', 'coupon.user_id', '=', 'users.id')
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
            ->join('users', 'membership_log.user_id', '=', 'users.id')
            ->join('membership_structure', 'membership_log.membership_id', '=', 'membership_structure.id')
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
        ->join('users','cards.refer_by','=','users.id')
        ->join('users as u2', 'cards.user_id', '=', 'u2.id')
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
        // $merchant_id=$merchant_id;
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
    public function state(Request $request)
    {
        $merchant_id = JWTAuth::parseToken()->getPayload()->get('merchant_id');
        $country_id = $request->country_id;
        $rules = [
            'country_id' => 'required',
        ];
        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            return response()->json([
                'error' => true,
                'message' => 'Validation Failed',
                'errors' => $validator->errors()
            ]);
        }
        $states = state::select('id','name','country_id')->where('country_id', $country_id)->get();
        return response()->json([
            'error' => false,
            'message' => 'all states',
            'states' => $states,
        ]);
    }
    
    public function cities(Request $request)
    {
        $merchant_id = JWTAuth::parseToken()->getPayload()->get('merchant_id');
        $country = $request->country;
        $state_id = $request->state_id;
        $rules = [
            'state_id' => 'required',
        ];
        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json([
                'error' => true,
                'message' => 'Validation Failed',
                'errors' => $validator->errors()
            ]);
        } 
        $cities = CitisNew::select('id','name','state_id')->where('state_id', $state_id)->get();

        return response()->json([
            'error' => false,
            'message' => 'all cities',
            'cities' => $cities,
        ]);

    }

    public function gettingregion(Request $request)
    {
      $merchant_id = JWTAuth::parseToken()->getPayload()->get('merchant_id');
        $rules = [
            'merchant_id' => 'required',
        ];
        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json([
                'error' => true,
                'message' => 'Validation Failed',
                'errors' => $validator->errors()
            ]);
        } 

      $region = MerchantRegion::select('city', 'region')->where('merchant_id',$merchant_id)->orderBy('region')->get();
      return response()->json([
          'error' => false,
          'message' => 'all regions',
          'region' => $region,
      ]);
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

    public function redeem_rewards(Request $request)
    {
        
        $rules=[
            // 'merchant_id'=>'Required',
            'reward_id'=>'Required',
            // 'user_id'=> 'Required'
        ];
        $validator = Validator::make($request->all(), $rules);
        
        if ($validator->fails()) {
            return response()->json([
                'error' => true,
                'message' => 'Validation Failed',
                'errors' => $validator->errors()
            ]);
        }
        else
        {
            $user = JWTAuth::parseToken()->authenticate();
            $user_id = $user->id;
            // Get the merchant_id from the JWT payload
            $merchant_id = JWTAuth::parseToken()->getPayload()->get('merchant_id');
            
            $merchant = MerchantDetails::where('user_id', $merchant_id)->first();
            if($merchant)
            {
                $loyalty=Rewards::where('id',$request->reward_id)->where('merchant_id',$merchant_id)->first();
                if($loyalty)
                {
                    $pp = $loyalty->points;
                    $userinfo=User::where('id',$user_id)->first();
                    $cards=Cards::where('merchant_id',$loyalty->merchant_id)->where('user_id',$user_id)->first();
                    if($cards)
                    {
                        $error=false;
                        if($cards->current_points >= $loyalty->points){
                            $error=true;
                        }
                        if($error)
                        {
                            try
                            {
                                \DB::beginTransaction();
                                $current_points=$cards->current_points-$loyalty->points;
                                if($merchant->card_type_id==2)
                                {
                                    $userpoints=UserPoints::where('merchant_id', $loyalty->merchant_id)->where('user_id', $user_id)->where('points','!=',0)->OrderBy('valid_till','asc')->get();
                                    $added_point=$loyalty->points;
                                    if (count ( $userpoints ) > 0)
                                    {
                                        foreach ( $userpoints as $points ) {
                                            if($points->points >= $loyalty->points){
                                                $points->points= $points->points - $loyalty->points;
                                                $userpoints=UserPoints::find($points->id);

                                                $userpoints->points=$points->points;
                                                $userpoints->save();
                                                break;
                                            }

                                            elseif($points->points < $loyalty->points){
                                                $pts= $loyalty->points - $points->points;
                                                if($pts==0){
                                                    break;
                                                }
                                                else{
                                                    $userpoints=UserPoints::find($points->id);
                                                    //echo $points->id;
                                                    $userpoints->points=0;
                                                    $userpoints->save();
                                                    $loyalty->points=$pts;

                                                }
                                            }
                                        }
                                    }
                                }
                                else
                                {
                                    $userstamps=UserStamps::where('merchant_id', $loyalty->merchant_id)
                                        ->where('user_id', $user_id)
                                        ->where('point_used','!=',0)
                                        ->OrderBy('valid_till','asc')
                                        ->get();
                                    $added_point=$loyalty->points;
                                    if (count ( $userstamps ) > 0) {
                                        $i=0;
                                        foreach ( $userstamps as $stamps ) {
                                            if($loyalty->points != $i){
                                                $userstamps=UserStamps::find($stamps->id);
                                                //echo $points->id;
                                                $userstamps->used=0;
                                                $userstamps->point_used=0;
                                                $userstamps->save();
                                            }else{
                                                break;
                                            }
                                            $i++;
                                        }
                                    }
                                }
                                //dd($added_point);
                                //$user->save();
                                $copyrewards = Rewards::find($request->reward_id)->replicate();
                                $copyrewards->class='rewards';
                                $copyrewards->base_id=$request->reward_id;
                                $copyrewards->valid_till=date('Y-m-d',strtotime("+".$copyrewards->validity." days"));

                                if (empty($copyrewards->start_date) || $copyrewards->start_date == '0000-00-00') {
                                    $copyrewards->start_date = date('Y-m-d');  // Set current date if start_date is invalid
                                } else {
                                    $copyrewards->start_date = date('Y-m-d', strtotime($copyrewards->start_date));
                                }
                                
                                if (empty($copyrewards->end_date) || $copyrewards->end_date == '0000-00-00') {
                                    $copyrewards->end_date = date('Y-m-d',strtotime("+".$copyrewards->validity." days"));  // Set null if end_date is invalid
                                } else {
                                    $copyrewards->end_date = date('Y-m-d', strtotime($copyrewards->end_date));
                                }
                                //$loyalty->class='rewards';
                                $cards->current_points=$current_points;
                                $cards->redeem_points = $cards->redeem_points + $loyalty->points;
                                if($cards->save() && $copyrewards->save())
                                {
                                    $userreward=new UserReward();
                                    $userreward->reward_id=$copyrewards->id;
                                    $userreward->user_id=$cards->user_id;
                                    $userreward->merchant_id=$cards->merchant_id;
                                    $userreward->base_id=$request->reward_id;
                                    $userreward->save();
                                    //$iid=$userreward->id;
                                    $trakredeem=new Redeempoints();
                                    $trakredeem->merchant_id=$loyalty->merchant_id;
                                    $trakredeem->user_id=$user_id;
                                    $trakredeem->mobile_no=$userinfo->mobile;
                                    $trakredeem->point_redeem=$pp; //$loyalty->points;
                                    $trakredeem->feedback=$loyalty->name;
                                    $trakredeem->redeem_by='user';
                                    $trakredeem->source = 'Custom App';
                                    $trakredeem->url = 'loyaltyredeem';
                                    $trakredeem->date = date('Y-m-d');
                                    $trakredeem->time = date("H:i:s");
                                    $trakredeem->day = date("l");
                                    //old function not
                                    $trakredeem->pos_billing_dump_id= 0; 
                                    $trakredeem->gms_id= 0;
                                    $trakredeem->bill_no= '';
                                    $trakredeem->bill_amount='';
                                    $trakredeem->point_redeem_value=0;
                                    $trakredeem->M_account='';
                                    $trakredeem->tag='';
                                    $trakredeem->server='';
                                    $trakredeem->services='';
                                    $trakredeem->section='';
                                    $trakredeem->table_counter='';
                                    $trakredeem->outlet_id='';
                                    $trakredeem->reversal_bill_amount='';
                                    $trakredeem->original_bill_number='';
                                    $trakredeem->original_bill_date=date('Y-m-d');
                                    $trakredeem->reversal_entry=0;
                                    $trakredeem->actual_creditgiven=0;
                                    $trakredeem->online_ordering_redemption=0;

                                    //old function not
                                    $trakredeem->save();

                                    $coupon=new Coupon();
                                    $coupon->user_id=$cards->user_id;
                                    $coupon->coupon_code=$this->createCouponCode();
                                    $coupon->class='rewards';
                                    $coupon->foreign_id=$userreward->reward_id;
                                    $coupon->merchant_id=$cards->merchant_id;
                                    $coupon->is_active=1;
                                    //old function not
                                    $coupon->pos_billing_dump_id=0;
                                    $coupon->gms_id=0;
                                    $coupon->feedback = '';
                                    $coupon->is_used = 0;
                                    $coupon->base_id = 0;
                                    $coupon->M_account = '';
                                    $coupon->source = '';
                                    $coupon->url = '';
                                    $coupon->date = date('Y-m-d');
                                    $coupon->time = date("H:i:s");
                                    $coupon->day = date("l");
                                    $coupon->bill_amount = '';
                                    $coupon->tag ='';
                                    $coupon->server ='';
                                    $coupon->services ='';
                                    $coupon->section ='';
                                    $coupon->table_counter ='';
                                    $coupon->bill_number ='';
                                    $coupon->outlet_id ='';
                                    $coupon->online_redeem_coupon_temp_id =0;
                                    $coupon->online_order_class =0;
                                    $coupon->pp_before_discount ='';
                                    $coupon->pp_discount_value ='';
                                    $coupon->pp_after_discount ='';

                                    //old function not
                                    $coupon->save();
                                    
                                    $parameter = Parameter::where('merchant_id','=',$loyalty->merchant_id)->where('user_id','=',$user_id)->lockForUpdate()->first();
                                    if($merchant->card_type_id==2)
                                    {
                                        $parameter->totalCreditRedeemed = $parameter->totalCreditRedeemed + $added_point;
                                    }
                                    else
                                    {
                                        $parameter->totalStampRedeemed = $parameter->totalStampRedeemed + $added_point;
                                    }
                                    $parameter->totalRewardGiven = $parameter->totalRewardGiven + 1;
                                    $parameter->save();
                                    $LoginWiseParameter = LoginWiseParameter::where('merchant_id',$loyalty->merchant_id)->where('login_id','Others')->lockForUpdate()->first();
                                    $LoginWiseParameter->credits_redeemed = $LoginWiseParameter->credits_redeemed + $added_point;
                                    $LoginWiseParameter->save();
                                    $LoginWiseParameterDaily = LoginWiseParameterDaily::where('merchant_id',$loyalty->merchant_id)->where('login_id','Others')->lockForUpdate()->first();
                                    $LoginWiseParameterDaily->credits_redeemed = $LoginWiseParameterDaily->credits_redeemed + $added_point;
                                    $LoginWiseParameterDaily->save();
                                    $MULtable = MULtable::where('merchant_id',$loyalty->merchant_id)->where('user_id', $user_id)->where('login_id','Others')->lockForUpdate()->first();
                                    if(!$MULtable)
                                    {
                                        $MULtable = new MULtable();
                                        $MULtable->merchant_id = $loyalty->merchant_id;
                                        $MULtable->user_id = $user_id;
                                        $MULtable->login_id = 'Others';
                                        //old function not
                                        $MULtable->added_by = '';
                                        $MULtable->first_visit = date('Y-m-d');
                                        $MULtable->last_visit = date('Y-m-d');
                                        $MULtable->actual_total_visits = 0;
                                        $MULtable->next_visit_date =date('Y-m-d');
                                        $MULtable->second_visit = date('Y-m-d');
                                        $MULtable->upload_date = date('Y-m-d');
                                        $MULtable->average_visit_per_month ='';
                                        $MULtable->wallet_issued_counter =0;
                                        $MULtable->wallet_redeemed_counter =0;
                                        // dd($added_point);
                                        //old function not
                                        // $MULtable->credits_redeemed = $MULtable->credits_redeemed + $added_point; 
                                        $MULtable->credits_redeemed=$added_point;

                                    }
                                    else
                                    {
                                        $MULtable->credits_redeemed = $MULtable->credits_redeemed + $added_point;
                                        // $MULtable->credits_redeemed=$added_point;
                                    }
                                    $MULtable->save();
                                    \DB::commit();
                                    return response()->json(array(
                                        'error'=>false,
                                        'message'=>"Successfully claimed",
                                        'data' => array("currentpoints"=>$current_points,'rewardid'=>$userreward->reward_id,'coupoCode'=>$coupon->coupon_code),
                                    ));
                                }
                                else
                                {
                                    return response()->json([
                                        'error' => false,
                                        'message' => "Reward claim failed."
                                    ]);
                                }
                            }
                            catch (Exception $e)
                            {
                                \DB::rollback();
                                return response()->json([
                                    'error' => false,
                                    'message' => "Transaction unsuccessful. Please try again."
                                ]);
                            }
                        }
                        else
                        {
                            return response()->json([
                                'error' => false,
                                'message' => "You don't have enough points to claim this reward"
                            ]);
                        }
                    }
                    else
                    {
                        return response()->json([
                            'error' => false,
                            'message' => "This number is not registered in the membership program. Please contact reception"
                        ]);
                    }
                }
                else
                {
                    return response()->json([
                        'error' => false,
                        'message' => "Incorrect reward id"
                    ]);
                }

            }
            else
            {
                return response()->json([
                    'error' => false,
                    'message' => "Incorrect Merchant Id",
                ]);
            }
        }
    }

    public function createCouponCode() {
        $couponcode = $this->couponCodeGenerator(5);
        $couponcode_select = Coupon::where('coupon_code',$couponcode)->first();
        $couponcode_retry = $this->recreatecouponcode($couponcode_select,$couponcode);
        return $couponcode_retry;
    }
    function recreatecouponcode($couponcode_select,$couponcode)
    {
        if($couponcode_select) {
            $newCouponCode = $this->couponCodeGenerator(6);
            if($couponcode == $newCouponCode) {
                $this->createCouponCode();
            } else {
                return $couponcode;
            }
        } else {
            return $couponcode;
        }
    }
    function couponCodeGenerator($loop)
    {
        $input = range('A','Z');
        $random_generator="";
        $count = 0;
        for($i=1;$i<$loop+1;$i++) {
            if($i%3 == 0){
                $random_generator .=rand(0,9).rand(0,9);
                $count = 0;
            } else {
                $random_generator .=$input[array_rand($input)];
                $count++;
            }
        }
        return $random_generator;
    }
    function referral_programsubmit(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $user_id = $user->id;
        $merchant_id = JWTAuth::parseToken()->getPayload()->get('merchant_id');

        $merchant = MerchantDetails::where('user_id', $merchant_id)->first();

        $master = Master::where('id',1)->first();
        $ewards_url = $master->ewards_url;
        $checkuser_url = $ewards_url.'onepage/checkuseronepage';
        $checkuser_data = [
            'mobile_no'=> $request->mobile,
            'country_code' => $request->country_code,
            'refer_name'=> $request->name,
            'refer_dob'=> $request->dob,
            'refer_email'=> $request->email,
            'login_id' => $merchant->email,
            'login_type' => 'merchant',
            'merchant_id' => $merchant_id
        ];

        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_URL => $checkuser_url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => '',
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 0,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => 'POST',
            CURLOPT_POSTFIELDS => $checkuser_data,
        ));

        $response = curl_exec($curl);
        $httpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
        curl_close($curl);
        if ($httpCode == 200) {
            $curl_res = json_decode($response);
            if($curl_res->error == false){

                return response()->json(
                    $curl_res
                );
                // return response()->json(array(
                //     'error'=>false,
                //     'message'=>'Referral Added Successfully',
                // ));
            }else{
                return response()->json(
                    $curl_res
                );
            }

            
        } else {
            return response()->json([
                'status' => 'error',
                'message' => 'Some Error occured!!',
                'error_code' => $httpCode
            ], $httpCode);
        }

        
    }
    public function deletaccount(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $user_id = $user->id;
        $merchant_id = JWTAuth::parseToken()->getPayload()->get('merchant_id');
        $delect_acc= Cards::where('user_id', $user_id)->where('merchant_id', $merchant_id)->update(['deactivate_account' => 1]);
        if($delect_acc)
        {
            return response()->json([
                'error' => false,
                'message' => 'Account Deleted Successfully',
            ]);
        }
        
    }

    
}
