<?php
namespace Falvarez\Blog;

use Twig\Extension\AbstractExtension;
use Twig\TwigFilter;

class TagsExtension extends AbstractExtension
{
    public function getName()
    {
        return 'falvarez/tags';
    }

    /**
     * {@inheritdoc}
     */
    public function getFilters()
    {
        return [
            new TwigFilter('tagSort', [$this, 'tagSort']),
        ];
    }

    public function tagSort($item)
    {
        ksort($item);
        return $item;
    }
}
