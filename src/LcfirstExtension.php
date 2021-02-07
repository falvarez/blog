<?php
namespace Falvarez\Blog;

use Twig\TwigFilter;

class LcfirstExtension extends \Twig_Extension
{
    public function getName()
    {
        return 'falvarez/lcfirst';
    }

    /**
     * {@inheritdoc}
     */
    public function getFilters()
    {
        return [
            new TwigFilter('lcfirst', 'lcfirst')
        ];
    }
}
