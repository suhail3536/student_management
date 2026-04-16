from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .models import Student
from .serializers import StudentSerializer
from rest_framework.permissions import AllowAny


@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def student_list(request):
    if request.method == 'GET':
        students = Student.objects.all()
        serializer = StudentSerializer(students, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = StudentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)


@api_view(['PUT', 'DELETE'])
@permission_classes([AllowAny])
def student_detail(request, pk):
    student = Student.objects.get(id=pk)

    if request.method == 'PUT':
        serializer = StudentSerializer(student, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

    elif request.method == 'DELETE':
        student.delete()
        return Response({"message": "Deleted"})