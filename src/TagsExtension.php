<?php
namespace Falvarez\Blog;

class TagsExtension extends \Twig_Extension
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
            new \Twig_SimpleFilter('tagSort', [$this, 'tagSort']),
        ];
    }

    public function tagSort($item)
    {
        ksort($item);
        return $item;
    }
}
