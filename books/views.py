from django.shortcuts import render
from rest_framework import viewsets

from .models import Book, Student
from .serializers import BookSerializer, StudentSerializer


class BookViewSet(viewsets.ModelViewSet):

    queryset = Book.objects.all()
    serializer_class = BookSerializer


class StudentViewSet(viewsets.ModelViewSet):

    queryset = Student.objects.all()
    serializer_class = StudentSerializer


def home(request):
    return render(request, 'books/home.html')