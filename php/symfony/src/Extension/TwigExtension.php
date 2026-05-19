<?php

namespace App\Extension;

use Symfony\Component\Uid\Uuid;
use Twig\Extension\AbstractExtension;
use Twig\TwigFilter;
use Twig\TwigFunction;

class TwigExtension extends AbstractExtension {
    public function __construct(
        private readonly PhpExtension $php,
    ) {}

    public function getFunctions(): array {
        return [
            new TwigFunction(name: 'get_uuid', callable: $this->getUuidFunction(...)),
        ];
    }

    public function getFilters(): array {
        return [
            new TwigFilter(name: 'json_decode', callable: $this->jsonDecodeFilter(...)),
            new TwigFilter(name: 'str_starts_with', callable: $this->strStartWithFilter(...)),
            new TwigFilter(name: 'str_ends_with', callable: $this->strEndWithFilter(...)),
            new TwigFilter(name: 'str_like', callable: $this->strLikeFilter(...)),
            new TwigFilter(name: 'str_pad', callable: $this->strPadFilter(...)),
            new TwigFilter(name: 'trim', callable: $this->trimFilter(...)),
            new TwigFilter(name: 'shuffle_array', callable: $this->shuffleArrayFilter(...)),
        ];
    }

    public function getUuidFunction(): string {
        return Uuid::v7();
    }

    public function jsonDecodeFilter(string $json): mixed {
        if(json_validate($json)) {
            return json_decode($json, true);
        }

        return false;
    }

    public function strStartWithFilter(string $str, string $needle): bool {
        return str_starts_with($str, $needle);
    }

    public function strEndWithFilter(string $str, string $needle): bool {
        return str_ends_with($str, $needle);
    }

    public function strLikeFilter(string $str, string $needle, bool $ignoreCase = false): bool {
        return $this->php->strLike($str, $needle, $ignoreCase);
    }

    public function strPadFilter(string $str, int $padLength, string $padString, string $direction = 'left'): string {
        $pad = match($direction) {
            'right' => STR_PAD_RIGHT,
            'both'  => STR_PAD_BOTH,
            default => STR_PAD_LEFT,
        };

        return str_pad($str, $padLength, $padString, $pad);
    }

    public function trimFilter(mixed $input): array|string {
        return $this->php->trim($input);
    }

    public function shuffleArrayFilter(array $array): array {
        shuffle($array);

        return $array;
    }
}
