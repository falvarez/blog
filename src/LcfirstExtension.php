<?php
namespace Falvarez\Blog;

use Twig\Extension\AbstractExtension;
use Twig\TwigFilter;

class LcfirstExtension extends AbstractExtension
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
