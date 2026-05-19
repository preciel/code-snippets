<?php

namespace App\Extension;

class PhpExtension {
    public function strLike(string $str, string $needle, bool $ignoreCase = false): bool {
        if($ignoreCase) {
            return str_contains(strtolower($str), strtolower($needle));
        } else {
            return str_contains($str, $needle);
        }
    }

    public function trim(mixed $input): array|string {
        return !is_array($input) ? trim($input) : array_map([$this, 'trim'], $input);
    }
}
