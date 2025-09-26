<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        $rules = [
            'userType' => 'required|in:student,teacher,parent',
            'basicData.firstName' => 'required|string|min:2',
            'basicData.lastName' => 'required|string|min:2',
            'basicData.email' => 'required|email|unique:users,email',
            'basicData.phone' => ['required', 'regex:/^\+20[0-9]{10}$/'],
            'basicData.password' => [
                'required',
                'min:8',
                'regex:/[A-Z]/',
                'regex:/[0-9]/'
            ],
        ];

        $userType = $this->input('userType');

        if ($userType === 'student') {
            $rules = array_merge($rules, [
                'basicData.grade' => 'required|string',
                'basicData.birthDate' => 'required|date|before:-6 years|after:-25 years',
            ]);
        } elseif ($userType === 'teacher') {
            $rules = array_merge($rules, [
                'teacherData.specialization' => 'required|string',
                'teacherData.yearsOfExperience' => 'required|string',
                'cv' => 'required|file|mimes:pdf,doc,docx|max:5120',
            ]);
        } elseif ($userType === 'parent') {
            $rules = array_merge($rules, [
                'parentData.childrenCount' => 'required|string',
            ]);
        }

        return $rules;
    }

    public function messages()
    {
        return [
            'basicData.firstName.required' => 'الاسم الأول مطلوب',
            'basicData.firstName.min' => 'الاسم يجب أن يكون حرفين على الأقل',
            'basicData.lastName.required' => 'اسم العائلة مطلوب',
            'basicData.lastName.min' => 'اسم العائلة يجب أن يكون حرفين على الأقل',
            'basicData.email.required' => 'البريد الإلكتروني مطلوب',
            'basicData.email.email' => 'البريد الإلكتروني غير صحيح',
            'basicData.email.unique' => 'البريد الإلكتروني مستخدم بالفعل',
            'basicData.phone.required' => 'رقم الهاتف مطلوب',
            'basicData.phone.regex' => 'رقم الهاتف يجب أن يكون رقم مصري صحيح',
            'basicData.password.required' => 'كلمة المرور مطلوبة',
            'basicData.password.min' => 'كلمة المرور يجب أن تكون 8 أحرف على الأقل',
            'basicData.password.regex' => 'كلمة المرور يجب أن تحتوي على حرف كبير ورقم على الأقل',
        ];
    }
}
