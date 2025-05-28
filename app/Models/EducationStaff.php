<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EducationStaff extends Model
{
    use HasFactory;

    public const GENDER_L = 'L';
    public const GENDER_P = 'P';

    public const ALL_GENDERS = [
        self::GENDER_L,
        self::GENDER_P,
    ];

    protected $fillable = [
        'user_id',
        'nip',
        'name',
        'gender',
        'place_of_birth',
        'date_of_birth',
        'address',
        'phone_number',
        'email',
        'position',
        'hire_date',
        'last_education',
        'major_education',
        'foto_profil',
    ];

    protected function casts(): array
    {
        return [
            'date_of_birth' => 'date',
            'hire_date' => 'date',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}