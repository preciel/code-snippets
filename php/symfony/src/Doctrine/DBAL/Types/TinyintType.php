<?php

namespace App\Doctrine\DBAL\Types;

use Doctrine\DBAL\Platforms\AbstractPlatform;
use Doctrine\DBAL\Types\Type;

class TinyintType extends Type {
    private const string TINYINT = 'tinyint';

    public function getName(): string {
        return self::TINYINT;
    }

    public function getSQLDeclaration(array $column, AbstractPlatform $platform): string {
        $declaration = "TINYINT(1)";

        if(!empty($column['unsigned'])) {
            $declaration .= " UNSIGNED";
        }

        if(!empty($column['autoincrement'])) {
            $declaration .= ' AUTO_INCREMENT';
        }

        $declaration .= " COMMENT '(DC2Type:tinyint)'";

        return $declaration;
    }

    public function convertToPHPValue($value, AbstractPlatform $platform): ?int {
        return $value === null
            ? null
            : (int)$value;
    }

    public function convertToDatabaseValue($value, AbstractPlatform $platform): ?int {
        return $value === null
            ? null
            : (int)$value;
    }
}