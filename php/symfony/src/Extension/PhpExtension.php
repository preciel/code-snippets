<?php

namespace App\src\Extension;

class PhpExtension {
    public function strStartWith(string $str, string $needle): bool {
        if($str === '' || $needle === '' || strlen($needle) > strlen($str) || substr_compare($str, $needle, 0, strlen($needle)) !== 0) {
            return false;
        } else {
            return true;
        }
    }

    public function strEndWith(string $str, string $needle): bool {
        if($str === '' || $needle === '' || strlen($needle) > strlen($str) || substr_compare($str, $needle, strlen($str)-strlen($needle), strlen($needle)) !== 0) {
            return false;
        } else {
            return true;
        }
    }
    public function strLike(string $str, string $needle, bool $ignoreCase = false): bool {
        if($ignoreCase) {
            return str_contains(strtolower($str), strtolower($needle));
        } else {
            return str_contains($str, $needle);
        }
    }

    public function strPad(string $str, int $padLength, string $padString, string $direction = 'left'): string {
        $strPad = null;

        if($direction == 'left') {
            $strPad = STR_PAD_LEFT;
        } elseif($direction == 'right') {
            $strPad = STR_PAD_RIGHT;
        } elseif($direction == 'both') {
            $strPad = STR_PAD_BOTH;
        }

        if($strPad !== null) {
            return str_pad($str, $padLength, $padString, $strPad);
        } else {
            return $str;
        }
    }

    public function trim($input): array|string {
        return !is_array($input) ? trim($input) : array_map([$this, 'trim'], $input);
    }
}