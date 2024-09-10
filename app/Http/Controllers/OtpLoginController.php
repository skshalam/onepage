<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Response;
use Illuminate\Support\Facades\Validator;
use App\Models\MerchantDetails;
use App\Models\LoyaltyProgram;
use App\Models\Employee;
use App\Models\User;
use App\Models\Cards;
use App\Models\WlOtp;
use App\Models\OtpLoginTrack;
use App\Models\Master;
use App\Models\TransactionalSmsStructure;
use Illuminate\Http\Request;
use JWTAuth;
use Auth;

class OtpLoginController extends Controller
{
    public function websiteLogin(Request $request)
    {
        $rules=[
            'mobile'=>'required|numeric|between:1000,9999999999999999',
            'merchant_id'=>'Required',
            'merchantid'=>'Required'
        ];
        $validator=Validator::make($request->all(),$rules);
        if($validator->fails())
        {
            $data = ['error'=>true,
                'message'=>'Please enter a valid number',
                'data' => new \Illuminate\Database\Eloquent\Collection,];
            $data = json_decode(json_encode($data, JSON_FORCE_OBJECT));
            return response()->json($data);
        }
        else
        {
            DB::disableQueryLog();
            $merchant = MerchantDetails::where('user_id', $request->merchant_id)->where('api_header',$request->merchantid)->first();
            if($merchant)
            {
                $loyalty = LoyaltyProgram::where('merchant_id', '=',$request->merchant_id)->first();
                if($loyalty)
                {
                    $merchant_email= User::where('id',$request->merchant_id)->first();
                    if($merchant)
                    {
                        $actual_country_code = $merchant->country_code;
                        if(isset($request->merchant_email))
                        {
                            if($merchant_email->email == $request->merchant_email)
                            {
                                $email = $request->merchant_email;
                                $added_by_id = $merchant->user_id;
                                $merchant_type = 'merchant';
                                $actual_country_code = $merchant->country_code;
                            }
                            else
                            {
                                $employee = Employee::where('email',$request->merchant_email)->where('merchant_id',$request->merchant_id)->where('is_active',1)->where('deleted',0)->first();
                                if(!$employee)
                                {
                                    $data = ['error'=>true,
                                        'message'=>'Incorrect Merchant Email Id',
                                        'data' => new \Illuminate\Database\Eloquent\Collection,];
                                    $data = json_decode(json_encode($data, JSON_FORCE_OBJECT));
                                    gc_collect_cycles();
                                    return response()->json($data);
                                }
                                $email = $request->merchant_email;
                                $added_by_id = $employee->id;
                                $merchant_type = 'employee';
                                $actual_country_code = $employee->country_code;
                            }
                        }
                        else
                        {
                            $email = $merchant_email->email;
                            $added_by_id = $merchant->user_id;
                            $merchant_type = 'merchant';
                            $actual_country_code = $merchant->country_code;
                        }
                        if(isset($request->country_code))
                        {
                            $country_code = str_replace("+","",$request->country_code);
                            if($country_code == '')
                            {
                                $country_code = $actual_country_code;
                            }
                        }
                        else
                        {
                            $country_code = $actual_country_code;
                        }
                        $cardscheck = 0;
                        $user = User::where('mobile',$request->mobile)->where('country_code',$country_code)->where('user_type',1)->first();
                        if($user)
                        {
                           $cards = Cards::where('user_id',$user->id)->where('merchant_id',$request->merchant_id)->first();
                           if($cards)
                           {
                              $cardscheck = 1;
                           }
                           else
                           {
                              if($merchant->website_add_member==0)
                              {
                                 $otp_login_track = new OtpLoginTrack();
                                 $otp_login_track->rejected_status = '1';
                                 $otp_login_track->merchant_id = $request->merchant_id;
                                 $otp_login_track->mobile = $request->mobile;
                                 $otp_login_track->otp = '';
                                 $otp_login_track->otp_status = '';
                                 $otp_login_track->source = 'whitel';
                                 $otp_login_track->url = 'login';
                                 $otp_login_track->type = '2';
                                 $otp_login_track->country_code = $country_code;
                                 $otp_login_track->save();
                                 gc_collect_cycles();
                                 return response()->json(array(
                                    'error'=>true,
                                    'message'=>'This number is not registered in the membership program. Please contact reception',
                                    'data' => array('otp_msg'=>'','otp'=>''),
                                 ));
                              }
                           }
                        }
                        else
                        {
                            if($merchant->website_add_member==0)
                            {
                                $otp_login_track = new OtpLoginTrack();
                                $otp_login_track->rejected_status = '1';
                                $otp_login_track->merchant_id = $request->merchant_id;
                                $otp_login_track->mobile = $request->mobile;
                                $otp_login_track->otp = '';
                                $otp_login_track->otp_status = '';
                                $otp_login_track->source = 'website';
                                $otp_login_track->url = 'websiteLogin';
                                $otp_login_track->type = '2';
                                $otp_login_track->country_code = $country_code;
                                $otp_login_track->save();
                                gc_collect_cycles();
                                return response()->json(array(
                                    'error'=>true,
                                    'message'=>'This number is not registered in the membership program. Please contact reception',
                                    'data' => array('otp_msg'=>'','otp'=>''),
                                ));
                            }
                        }
                        // new code start
                        $otpCode=$this->uniqueCodeGeneration();
                        $data = [];
                        $data['otp'] = $otpCode;
                        // $msg = $this->smsPushContentGenerateSms($merchant,$user,$merchant_type,$email,'wl_login',$data,$merchant->business_name);
                        $details = [
                           'otp' => $otpCode,
                        ];
                        $activity_type = 'wl_login';
                        $sms = $this->getsmsdlttransactional($merchant->user_id,$email,$activity_type,$merchant_type,$merchant->business_name,$details);

                        // $msg = $otpCode.' is your OTP to login to '.$merchant->business_name.' Account';
                        $msg  = $sms['sms'];
                        $WlOtp = WlOtp::where('merchant_id',$request->merchant_id)->where('country_code',$country_code)->where('mobile',$request->mobile)->first();
                        if($WlOtp)
                        {
                           $WlOtp->otp = $otpCode;
                        }
                        else
                        {
                           $WlOtp = new WlOtp();
                           $WlOtp->otp = $otpCode;
                           $WlOtp->merchant_id = $request->merchant_id;
                           $WlOtp->mobile = $request->mobile;
                           $WlOtp->country_code = $country_code;
                           $WlOtp->user_id = 0;
                           $WlOtp->source = '';
                           $WlOtp->url = '';
                        }
                        $WlOtp->save();
                        $otp_login_track = new OtpLoginTrack();
                        $otp_login_track->rejected_status = '0';
                        $otp_login_track->merchant_id = $request->merchant_id;
                        $otp_login_track->mobile = $request->mobile;
                        $otp_login_track->otp = $otpCode;
                        $otp_login_track->otp_status = 'P';
                        $otp_login_track->source = 'website';
                        $otp_login_track->url = 'websiteLogin';
                        $otp_login_track->country_code = $country_code;
                        $otp_login_track->type = '2';
                        $otp_login_track->save();
                        // if($cardscheck == 1){
                        //    $this->smsPushContentGenerate($merchant,$user,$merchant_type,$email,'wl_login',$data,$merchant->business_name);
                        // }
                        // else{
                        //    if($merchant->communication_categorie == 1 || $merchant->communication_categorie == 3 || $merchant->communication_categorie == 4 || $merchant->communication_categorie == 6 || $merchant->communication_categorie == 8){
                        //       if($merchant->sms == 'Yes')
                        //       {
                        //          $this->sendSmsIndividualy($msg, $request->mobile, $merchant->user_id,$merchant_type, $email);
                        //       }
                        //    }
                        // }
                        // $this->sendSmsIndividualy($msg, $request->mobile, $merchant->user_id,$merchant_type, $email,$sms['telemarketer_id'],$sms['dlt_template_id'],$sms['entity_id'],$country_code);
                        // $otpCode = OtpLoginTrack::where('merchant_id',$merchant->user_id)->where('mobile',$request->mobile)->where('otp_status','P')->where('country_code',$country_code)->pluck('otp');
                        $extraSendSmsStructureDetails = array(
                            'otp' => $otpCode,
                            'bname' => $merchant->business_name
                        );
                        // $this->extrasendSmsstructure($msg, $request->mobile, $merchant->user_id,$merchant_type, $email,$sms['telemarketer_id'],$sms['dlt_template_id'],$sms['entity_id'],$country_code,$extraSendSmsStructureDetails);
                        gc_collect_cycles();
                        return response()->json(array(
                            'error'=>false,
                            'message'=>'OTP sent successfully',
                            'data' => array('otp_msg'=>base64_encode($msg),'otp'=>base64_encode($otpCode)),
                        ));
                        // new code end
                    }
                    else
                    {
                        gc_collect_cycles();
                        return response()->json(array(
                           'error'=>true,
                           'message'=>'Incorrect Merchant Id',
                           'data' => array('otp_msg'=>'','otp'=>''),
                        ));
                    }
                }
                else
                {
                    gc_collect_cycles();
                    return response()->json(array(
                        'error'=>true,
                        'message'=>"Program Structure hasn't been set yet",
                        'data' => array('otp_msg'=>'','otp'=>''),
                    ));
                }
            }
            else
            {
                gc_collect_cycles();
                return response()->json(array(
                    'error'=>true,
                    'message'=>"Incorrect Merchant Id",
                    'data' => array('otp_msg'=>'','otp'=>''),
                ));
            }
        }
    }

    public function uniqueCodeGeneration() {
        return str_pad(rand(0, 999999), 6, '0', STR_PAD_LEFT);
    }

    public function getsmsdlttransactional($mid,$login,$activity,$type,$bname,$details)
    {
        $arr = [
            'error' => true,
            'sms' => '',
            'entity_id' => '',
            'telemarketer_id' => '',
            'dlt_template_id' => '',
            'sms_unicode' => 0,
            'structure' => array(),
        ];
        if(!empty($details['advance_loyalty_id'])){
            $advance_loyalty_id = $details['advance_loyalty_id'];
        }
        else
        {
            $advance_loyalty_id = 0;
        }
        if($advance_loyalty_id != 0 and $advance_loyalty_id != '')
        {
            $str = TransactionalSmsStructure::where('merchant_id',$mid)->where('login',$login)->where('status',1)->where('activity',$activity)->where('structure_foreign_id',$advance_loyalty_id)->first();
        }
        else
        {
            $str = TransactionalSmsStructure::where('merchant_id',$mid)->where('login',$login)->where('status',1)->where('activity',$activity)->first();
        }
        if($str){
            if($advance_loyalty_id != 0 and $advance_loyalty_id != '')
            {
                $sms = $str->body_text;
            }
            else
            {
                $sms = $str->sms;
            }
            if(!empty($sms)){
                $sms = $this->getrefinesms($mid,$login,$activity,$sms,$type,$bname,$details);
            }
            /*if($str->merchant_id == '15732102' and $str->login =='17degreeshotel@gmail.com' and $str->activity== 'addPoints')
            {
                $errorlog = new ErrorLog();
                $errorlog->data = json_encode($str);
                $errorlog->class = 'check';
                $errorlog->url = 'check';
                $errorlog->source = 'check';
                $errorlog->save();
            }*/
            $arr = [
                'error' => false,
                'sms' => $sms,
                'entity_id' => $str->entity_id,
                'telemarketer_id' => $str->telemarketer_id,
                'dlt_template_id' => $str->dlt_template_id,
                'sms_unicode' => $str->sms_unicode,
                'structure' => $str
            ];
        }
        return $arr;
    }

    public function getrefinesms($mid,$login,$activity,$sms,$type,$bname,$details)
    {
        $merchant = MerchantDetails::where('user_id',$mid)->first();
        if($merchant){
            $outlet_name = '';
            $outlet_mobile_number = '';
            if($type == 'employee')
            {
                // ##Outlet Name## ##Outlet Number##
                $employee_details = Employee::where('merchant_id',$mid)->where('email',$login)->select('name','mobile_number')->first();
                if($employee_details){
                    $outlet_name = $employee_details->name;
                    $outlet_mobile_number = $employee_details->mobile_number;
                }
                
            }
            if(!empty($bname)){
                $sms = str_replace("##Business Name##",$bname,$sms);
            }
            else{
                $sms = str_replace("##Business Name##",'',$sms);
            }
            $sms = str_replace("##custom credits##",$merchant->credit_text_custom,$sms);
            
            if(!empty($details['otp'])){
                $sms = str_replace("##otp##",$details['otp'],$sms);
            }
        }
        return $sms;
    }

//     public function websiteOtpVerify(Request $request)
//    {
//         $rules=[
//             'otp'=>'Required',
//             'merchant_id'=>'Required',
//             'mobile'=>'required|numeric|between:1000,9999999999999999',
//             'merchantid'=>'Required'
//         ];
//         $validator=Validator::make($request->all(),$rules);
//         if($validator->fails())
//         {
//             $data = ['error'=>true,
//                 'message'=>'All field are mandatory',
//                 'data' => new \Illuminate\Database\Eloquent\Collection,];
//             $data = json_decode(json_encode($data, JSON_FORCE_OBJECT));
//             return Response::json($data);

//         }
//         $user = User::where('id', 15867532)->first();
//         if (!$token = JWTAuth::fromUser($user)) {
//             return response()->json(['error' => 'Unable to generate token'], 500);
//         }
//         return response()->json(["error"=>false,"message"=>$this->respondWithToken($token,$user)]);
        
        // else
        // {
        //     DB::disableQueryLog();
        //     Session::forget('first_login');
        //     $merchant = \MerchantDetails::where('user_id', $this->requestData['merchant_id'])->where('api_header',$this->requestData['merchantid'])->first();
        //     $merchant_email = User::where('id',$merchant->user_id)->first();
        //     if($merchant)
        //     {
        //        $source = !empty($this->requestData['source'])?$this->requestData['source']:'website';
        //         $actual_country_code = $merchant->country_code;
        //         $timezonedata = $this->timeZoneData($merchant->timezone,'');
        //         if(isset($this->requestData['merchant_email']))
        //         {
        //             if($merchant_email->email == $this->requestData['merchant_email'])
        //             {
        //                 $email = $this->requestData['merchant_email'];
        //                 $added_by_id = $merchant->user_id;
        //                 $merchant_type = 'merchant';
        //                 $actual_country_code = $merchant->country_code;
        //                 $timezonedata = $this->timeZoneData($merchant->timezone,'');
        //             }
        //             else
        //             {
        //                 $employee = Employee::where('email',$this->requestData['merchant_email'])->where('merchant_id',$this->requestData['merchant_id'])->where('is_active',1)->where('deleted',0)->first();
        //                 if(count($employee)<1)
        //                 {
        //                     $data = ['error'=>true,
        //                         'message'=>'Incorrect Merchant Email Id',
        //                         'data' => new \Illuminate\Database\Eloquent\Collection,];
        //                     $data = json_decode(json_encode($data, JSON_FORCE_OBJECT));
        //                     gc_collect_cycles();
        //                     return Response::json($data);
        //                 }
        //                 $email = $this->requestData['merchant_email'];
        //                 $added_by_id = $employee->id;
        //                 $merchant_type = 'employee';
        //                 $actual_country_code = $employee->country_code;
        //                 $timezonedata = $this->timeZoneData($merchant->timezone,'');
        //             }
        //         }
        //         else
        //         {
        //             $email = $merchant_email->email;
        //             $added_by_id = $merchant->user_id;
        //             $merchant_type = 'merchant';
        //         }
        //         if(isset($this->requestData['country_code']))
        //         {
        //             $country_code = str_replace("+","",$this->requestData['country_code']);
        //             if($country_code == '')
        //             {
        //                 $country_code = $actual_country_code;
        //             }
        //         }
        //         else
        //         {
        //             $country_code = $actual_country_code;
        //         }
        //         // new code start
        //        $WlOtp = WlOtp::where('merchant_id',$this->requestData['merchant_id'])->where('country_code',$country_code)->where('mobile',$this->requestData['mobile'])->where('otp',$this->requestData['otp'])->first();
        //        if($WlOtp)
        //        {
        //             $user = \User::where('mobile', $this->requestData['mobile'])->where('country_code',$country_code)->where('user_type','1')->where('user_type','1')->first();
        //             if($user)
        //             {
        //                 $cards = Cards::where('merchant_id',$this->requestData['merchant_id'])->where('user_id',$user->id)->first();
        //                 if($cards)
        //                 {
        //                     // old member
        //                     // need to do work later
        //                 }
        //                 else
        //                 {
        //                     if($merchant->website_add_member==0)
        //                     {
        //                         $otp_login_track = new OtpLoginTrack();
        //                         $otp_login_track->rejected_status = '1';
        //                         $otp_login_track->merchant_id = $this->requestData['merchant_id'];
        //                         $otp_login_track->mobile = $this->requestData['mobile'];
        //                         $otp_login_track->otp = $this->requestData['otp'];
        //                         $otp_login_track->otp_status = 'F';
        //                         $otp_login_track->source = $source;
        //                         $otp_login_track->url = 'websiteOtpVerify';
        //                         $otp_login_track->type = '2';
        //                         $otp_login_track->country_code = $country_code;
        //                         $otp_login_track->save();
        //                         $data = ['error'=>true,
        //                             'message'=>'This number is not registered in the membership program. Please contact reception',
        //                             'data' => new \Illuminate\Database\Eloquent\Collection,];
        //                         $data = json_decode(json_encode($data, JSON_FORCE_OBJECT));
        //                         gc_collect_cycles();
        //                         return Response::json($data);
        //                     }
                       
        //                     $data1 = $this->userAddToCards($merchant,$user,$source,'websitePtpVerify','',$email,$added_by_id,'','0',$merchant_type,$timezonedata);
        //                     if($data1['status'] == '1')
        //                     {
        //                         // here in card now
        //                         // need to do work later
        //                     }
        //                     else
        //                     {
        //                         $otp_login_track = new OtpLoginTrack();
        //                         $otp_login_track->rejected_status = '1';
        //                         $otp_login_track->merchant_id = $this->requestData['merchant_id'];
        //                         $otp_login_track->mobile = $this->requestData['mobile'];
        //                         $otp_login_track->otp = $this->requestData['otp'];
        //                         $otp_login_track->otp_status = 'F';
        //                         $otp_login_track->source = $source;
        //                         $otp_login_track->url = 'websiteOtpVerify';
        //                         $otp_login_track->type = '2';
        //                         $otp_login_track->country_code = $country_code;
        //                         $otp_login_track->save();
        //                         // return code
        //                         $data = ['error'=>true,
        //                             'message'=>'Transaction unsuccessful. Please try again.'.$data1['e'],
        //                             'data' => new \Illuminate\Database\Eloquent\Collection,];
        //                         $data = json_decode(json_encode($data, JSON_FORCE_OBJECT));
        //                         gc_collect_cycles();
        //                         return Response::json($data);
        //                     }
        //                     // need to add on card
        //                 }
        //                 // user is already on ewards database
        //             }
        //             else
        //             {
        //                 if($merchant->website_add_member==0)
        //                 {
        //                     $otp_login_track = new OtpLoginTrack();
        //                     $otp_login_track->rejected_status = '1';
        //                     $otp_login_track->merchant_id = $this->requestData['merchant_id'];
        //                     $otp_login_track->mobile = $this->requestData['mobile'];
        //                     $otp_login_track->otp = $this->requestData['otp'];
        //                     $otp_login_track->otp_status = 'F';
        //                     $otp_login_track->source = $source;
        //                     $otp_login_track->url = 'websiteOtpVerify';
        //                     $otp_login_track->type = '2';
        //                     $otp_login_track->country_code = $country_code;
        //                     $otp_login_track->save();
        //                     $data = ['error'=>true,
        //                         'message'=>'This number is not registered in the membership program. Please contact reception',
        //                         'data' => new \Illuminate\Database\Eloquent\Collection,];
        //                     $data = json_decode(json_encode($data, JSON_FORCE_OBJECT));
        //                     gc_collect_cycles();
        //                     return Response::json($data);
        //                 }
        //                 $data = $this->userTableAdd($this->requestData['mobile'],$source,'websitePtpVerify',$country_code);
        //                 if($data['status'] == '1')
        //                 {
        //                     Session::set('first_login','yes');                            
        //                     $user = \User::where('mobile', '=', $this->requestData['mobile'])->where('country_code',$country_code)->where('user_type', 1)->first();
        //                     $data1 = $this->userAddToCards($merchant,$user,$source,'websitePtpVerify','',$email,$added_by_id,'','0',$merchant_type,$timezonedata);
        //                     if($data1['status'] == '1')
        //                     {
        //                         // here in card now
        //                         // need to do work later
        //                     }
        //                     else
        //                     {
        //                         $otp_login_track = new OtpLoginTrack();
        //                         $otp_login_track->rejected_status = '1';
        //                         $otp_login_track->merchant_id = $this->requestData['merchant_id'];
        //                         $otp_login_track->mobile = $this->requestData['mobile'];
        //                         $otp_login_track->otp = $this->requestData['otp'];
        //                         $otp_login_track->otp_status = 'F';
        //                         $otp_login_track->source = $source;
        //                         $otp_login_track->url = 'websiteOtpVerify';
        //                         $otp_login_track->type = '2';
        //                         $otp_login_track->country_code = $country_code;
        //                         $otp_login_track->save();
        //                         // return code
        //                         $data = ['error'=>true,
        //                             'message'=>'Transaction unsuccessful. Please try again.'.$data1['e'],
        //                             'data' => new \Illuminate\Database\Eloquent\Collection,];
        //                         $data = json_decode(json_encode($data, JSON_FORCE_OBJECT));
        //                         gc_collect_cycles();
        //                         return Response::json($data);
        //                     }
        //                 }
        //                 else
        //                 {
        //                     $otp_login_track = new OtpLoginTrack();
        //                     $otp_login_track->rejected_status = '1';
        //                     $otp_login_track->merchant_id = $this->requestData['merchant_id'];
        //                     $otp_login_track->mobile = $this->requestData['mobile'];
        //                     $otp_login_track->otp = $this->requestData['otp'];
        //                     $otp_login_track->otp_status = 'F';
        //                     $otp_login_track->source = $source;
        //                     $otp_login_track->url = 'websiteOtpVerify';
        //                     $otp_login_track->type = '2';
        //                     $otp_login_track->country_code = $country_code;
        //                     $otp_login_track->save();
        //                     // return code
        //                     $data = ['error'=>true,
        //                         'message'=>'Transaction unsuccessful. Please try again.'.$data['e'],
        //                         'data' => new \Illuminate\Database\Eloquent\Collection,];
        //                     $data = json_decode(json_encode($data, JSON_FORCE_OBJECT));
        //                     gc_collect_cycles();
        //                     return Response::json($data);
        //                 }
        //                 // user need to add on
        //             }
        //             $cards = Cards::where('merchant_id',$this->requestData['merchant_id'])->where('user_id',$user->id)->first();
        //             if($cards)
        //             {
        //               // Session::set('showProfile','yes');
        //                 $cards->otp = $this->requestData['otp'];
        //                 $cards->save();
        //                 Session::put([
        //                     'mobile'=>$this->requestData['mobile'],
        //                     'otp'=>$this->requestData['otp'],
        //                     'country_code'=>$country_code,
        //                     'merchant_id' =>$this->requestData['merchant_id'],
        //                     'merchantid'=>$this->requestData['merchantid'],
        //                     'showmodallogin'=>1,
        //                     'user_id'=>$user->id,
        //                 ]);
                       
        //                 $data = ['error'=>false,
        //                     'message'=>'success',
        //                     'user_id' => $user->id,
        //                     'data' => new \Illuminate\Database\Eloquent\Collection,];
        //                 $data = json_decode(json_encode($data, JSON_FORCE_OBJECT));
        //                 gc_collect_cycles();
        //                 return Response::json($data);
        //             }
        //        }
        //        else
        //        {
        //             $otp_login_track = new OtpLoginTrack();
        //             $otp_login_track->rejected_status = '1';
        //             $otp_login_track->merchant_id = $this->requestData['merchant_id'];
        //             $otp_login_track->mobile = $this->requestData['mobile'];
        //             $otp_login_track->otp = $this->requestData['otp'];
        //             $otp_login_track->otp_status = 'F';
        //             $otp_login_track->source = $source;
        //             $otp_login_track->url = 'websiteOtpVerify';
        //             $otp_login_track->type = '2';
        //             $otp_login_track->country_code = $country_code;
        //             $otp_login_track->save();
        //             $data = ['error'=>true,
        //                 'message'=>'Invalid OTP',
        //                 'data' => new \Illuminate\Database\Eloquent\Collection,];
        //             $data = json_decode(json_encode($data, JSON_FORCE_OBJECT));
        //             gc_collect_cycles();
        //             return Response::json($data);
        //        }
        //         // new code end
        //     }
        //     else
        //     {
        //         $data = ['error'=>true,
        //             'message'=>'Incorrect Merchant Id',
        //             'data' => new \Illuminate\Database\Eloquent\Collection,];
        //         $data = json_decode(json_encode($data, JSON_FORCE_OBJECT));
        //         gc_collect_cycles();
        //         return Response::json($data);
        //     }
        // }
    // }

    public function refresh()
    {
        return $this->respondWithToken(auth()->refresh());
    }

    protected function respondWithToken($token,$user=null,$curl_res_data=null)
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth('api')->factory()->getTTL() * 60,
            'user' => $user,
            'curl_res_data' => $curl_res_data
        ]);
    }

    public function onePageLoginOtpVerifyNew(Request $request)
    {
        $rules = [
            'otp'=>'Required',
            'merchant_id'=>'Required',
            'mobile'=>'required|numeric|between:1000,9999999999999999',
            'merchantid'=>'Required'
        ];

        $validator = Validator::make($request->input(), $rules);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }
        $master = Master::where('id',1)->first();
        $ewards_url = $master->ewards_url;

        $url = $ewards_url.'onepagewebsite/websiteOtpVerify';

        $data = [
            'otp'=> $request-> otp,
            'merchant_id'=> $request-> merchant_id,
            'mobile'=> $request-> mobile,
            'merchantid'=> $request-> merchantid,
        ];

        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => '',
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 0,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => 'POST',
            CURLOPT_POSTFIELDS => $data,
        ));

        //Execute the request
        $response = curl_exec($curl);
        $httpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
        curl_close($curl);

        if ($httpCode == 200) {
            $curl_res = json_decode($response);
            if($curl_res->error == false){
                $user = User::where('id',$curl_res->user_id)->first();
                if (!$token = JWTAuth::fromUser($user)) {
                    return response()->json(['error' => 'Unable to generate token'], 500);
                }
                if($user){
                    $token = JWTAuth::claims(['merchant_id' => $request->merchant_id])->fromUser($user);
                }
                return response()->json(["error"=>false,"message"=>$this->respondWithToken($token,$user,json_decode($response, true))]);
            }

            return response()->json([
                
            ], 200);
        } else {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to verify OTP',
                'error_code' => $httpCode
            ], $httpCode);
        }

    }
}
