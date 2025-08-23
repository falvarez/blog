<?php
namespace Falvarez\Blog;

use Twig\Extension\AbstractExtension;
use Twig\TwigFilter;

class SpanishDateExtension extends AbstractExtension
{
    public function getName(): string
    {
        return 'falvarez/spanishDate';
    }

    /**
     * {@inheritdoc}
     */
    public function getFilters(): array
    {
        return [
            new TwigFilter('spanish_date', [$this, 'spanishDate']),
        ];
    }

    public function spanishDate($date): string
    {
        if (is_int($date)) {
            $date = (new \DateTimeImmutable())->setTimestamp($date);
        } elseif (is_string($date)) {
            $date = new \DateTimeImmutable($date);
        } elseif (! $date instanceof \DateTimeInterface) {
            // No hay fecha
            return "";
        }

        $formatter = new \IntlDateFormatter(
            locale: 'es_ES',
            dateType: \IntlDateFormatter::FULL,
            timeType: \IntlDateFormatter::NONE,
            timezone: $date->getTimezone()
        );

        return mb_ucfirst($formatter->format($date));
    }
}
