<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AuthController extends Controller
{
    // Register new user
    public function register(Request $request)
    {
        try {
            // Validate
            $fields = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:6|confirmed',
            ]);

            // Create user
            $user = User::create([
                'name' => $fields['name'],
                'email' => $fields['email'],
                'password' => Hash::make($fields['password'])
            ]);

            // Create token
            $token = $user->createToken('authToken')->plainTextToken;

            return response()->json([
                'user' => $user,
                'token' => $token
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Login user
    public function login(Request $request)
    {
        // Validate the request
        try {
          
        $request->validate(
            [
                'email' => 'required',
                'password' => 'required|min:6'
            ],
            // Custom error messages
            [
                'email.required' => 'The email is required.',
                'password.required' => 'The password is required.',
                'password.min' => 'The password must be at least 6 characters.',
            ]
        );
        $user = User::where('email', $request->email)->first();

 
        // Check user
        if (!$user) {
            return response()->json([
                'message' => 'Invalid email '
            ], 401);
        }
        // Check password 
        if (!Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Invalid password'
            ], 401);
        }
        // Create token
        $token = $user->createToken('authToken')->plainTextToken;
         
        return response()->json([
            'user' => $user,
            'token' => $token
        ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Logout user
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully'
        ], 200);
    }

    // Get current user
    public function user(Request $request)
    {
        return response()->json([
            'user' => $request->user()
        ], 200);
    }
}
